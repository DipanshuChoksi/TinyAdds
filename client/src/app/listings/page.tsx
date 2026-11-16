"use client";

import { useEffect, useState, useTransition, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { getPublicPosts, type PublicPost } from "@/lib/postApi";
import { getPublicBannerSections } from "@/lib/bannerSectionApi";
import { getPublicGroups } from "@/lib/groupApi";
import { getPublicSearchCategories } from "@/lib/searchCategoryApi";
import { getPublicEmotions } from "@/lib/emotionApi";
import { getPublicCities } from "@/lib/cityApi";
import type { PublicCityResponse } from "@/types/city";

const PAGE_SIZE = 12;

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Search & Filter state synced with URL searchParams
  const search = searchParams.get("search") || "";
  const banner = searchParams.get("banner") || "";
  const group = searchParams.get("group") || "";
  const category = searchParams.get("category") || "";
  const emotion = searchParams.get("emotion") || "";
  const cityIdParam = searchParams.get("cityId") || "";
  const cityId = cityIdParam && !isNaN(Number(cityIdParam)) ? Number(cityIdParam) : undefined;
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Local input state for the search bar (debounced / on submit)
  const [searchInput, setSearchInput] = useState(search);

  // Master dropdown options
  const [bannerOptions, setBannerOptions] = useState<string[]>([]);
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [emotionOptions, setEmotionOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<PublicCityResponse[]>([]);

  // Post items & pagination state
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync search input if query param changes outside
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Load filter options once
  useEffect(() => {
    Promise.all([
      getPublicBannerSections().catch(() => null),
      getPublicGroups().catch(() => null),
      getPublicSearchCategories().catch(() => null),
      getPublicEmotions().catch(() => null),
      getPublicCities().catch(() => null),
    ]).then(([bannerRes, groupRes, catRes, emotionRes, cityRes]) => {
      if (bannerRes?.success && Array.isArray(bannerRes.data)) {
        setBannerOptions(bannerRes.data.map((b) => b.name).filter(Boolean));
      }
      if (groupRes?.success && Array.isArray(groupRes.data)) {
        setGroupOptions(groupRes.data.map((g) => g.name).filter(Boolean));
      }
      if (catRes?.success && Array.isArray(catRes.data)) {
        setCategoryOptions(catRes.data.map((c) => c.name).filter(Boolean));
      }
      if (emotionRes?.success && Array.isArray(emotionRes.data)) {
        setEmotionOptions(emotionRes.data.map((e) => e.name).filter(Boolean));
      }
      if (cityRes?.success && Array.isArray(cityRes.data)) {
        setCityOptions(cityRes.data);
      }
    });
  }, []);

  // Update query params helper
  const updateParams = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "") {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });
      startTransition(() => {
        const query = current.toString();
        router.push(query ? `/listings?${query}` : "/listings");
      });
    },
    [router, searchParams]
  );

  // Fetch posts whenever searchParams change
  useEffect(() => {
    let active = true;
    setLoading(true);

    getPublicPosts({
      search: search || undefined,
      banner: banner || undefined,
      searchGroup: group || undefined,
      searchCategory: category || undefined,
      emotion: emotion || undefined,
      cityId: cityId,
      page: currentPage,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        if (!active) return;
        if (res?.success && Array.isArray(res.data)) {
          setPosts(res.data);
          const meta = res.meta as { total?: number; totalPages?: number } | undefined;
          setTotal(meta?.total || res.data.length);
          setTotalPages(meta?.totalPages || Math.ceil((meta?.total || res.data.length) / PAGE_SIZE) || 1);
        } else {
          setPosts([]);
          setTotal(0);
          setTotalPages(1);
        }
      })
      .catch((err) => {
        console.error("Failed to load listings:", err);
        if (active) {
          setPosts([]);
          setTotal(0);
          setTotalPages(1);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, banner, group, category, emotion, cityId, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/listings");
    });
  };

  const hasActiveFilters = Boolean(search || banner || group || category || emotion || cityId !== undefined);

  return (
    <section className="lb-section py-5">
      <div className="container">
        <div className="row g-4 g-lg-5">
          {/* Filter Sidebar */}
          <aside className="col-lg-4 col-xl-3">
            <div className="lb-side">
              {/* Search Box */}
              {/* <div className="lb-side-box">
                <h3 className="lb-side-title">Search Ads</h3>
               
              </div> */}

              {/* Filters Box */}
              <div className="lb-side-box">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <h3 className="lb-side-title mb-0 border-bottom-0 pb-0">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="btn btn-sm text-danger p-0 text-decoration-none fw-semibold"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Banner Type Filter */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-1">
                    Banner Placement
                  </label>
                  <select
                    className="form-select"
                    value={banner}
                    onChange={(e) => updateParams({ banner: e.target.value, page: 1 })}
                  >
                    <option value="">All Banner Types</option>
                    {bannerOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Group Filter */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-1">
                    Group
                  </label>
                  <select
                    className="form-select"
                    value={group}
                    onChange={(e) => updateParams({ group: e.target.value, page: 1 })}
                  >
                    <option value="">All Groups</option>
                    {groupOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Category Filter */}
                {/* <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-1">
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* City Filter */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-1">
                    Location / City
                  </label>
                  <select
                    className="form-select"
                    value={cityId !== undefined ? String(cityId) : ""}
                    onChange={(e) => updateParams({ cityId: e.target.value || null, page: 1 })}
                  >
                    <option value="">All Locations</option>
                    {cityOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Emotion Filter */}
                <div className="mb-2">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-1">
                    Emotion / Vibe
                  </label>
                  <select
                    className="form-select"
                    value={emotion}
                    onChange={(e) => updateParams({ emotion: e.target.value, page: 1 })}
                  >
                    <option value="">All Emotions</option>
                    {emotionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="col-lg-8 col-xl-9">
            {/* Top toolbar */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
              <div>
                <h2 className="h4 mb-1 fw-bold text-dark">Ad Listings</h2>
                <p className="text-muted small mb-0">
                  {loading ? (
                    "Loading listings..."
                  ) : (
                    <>
                      Showing{" "}
                      <strong className="text-dark">
                        {total > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
                        {Math.min(currentPage * PAGE_SIZE, total)}
                      </strong>{" "}
                      of <strong className="text-dark">{total}</strong> results
                    </>
                  )}
                </p>
              </div>

              {/* {hasActiveFilters && (
                <div className="d-flex flex-wrap align-items-center gap-2">
                  {search && (
                    <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3">
                      <i className="bi bi-search text-muted" /> &ldquo;{search}&rdquo;
                      <button
                        type="button"
                        className="btn-close ms-1"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => updateParams({ search: null, page: 1 })}
                      />
                    </span>
                  )}
                  {banner && (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center gap-1 py-2 px-3">
                      Banner: {banner}
                      <button
                        type="button"
                        className="btn-close ms-1"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => updateParams({ banner: null, page: 1 })}
                      />
                    </span>
                  )}
                  {group && (
                    <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3">
                      Group: {group}
                      <button
                        type="button"
                        className="btn-close ms-1"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => updateParams({ group: null, page: 1 })}
                      />
                    </span>
                  )}
                  {category && (
                    <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3">
                      Category: {category}
                      <button
                        type="button"
                        className="btn-close ms-1"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => updateParams({ category: null, page: 1 })}
                      />
                    </span>
                  )}
                  {emotion && (
                    <span className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3">
                      Emotion: {emotion}
                      <button
                        type="button"
                        className="btn-close ms-1"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => updateParams({ emotion: null, page: 1 })}
                      />
                    </span>
                  )}
                </div>
              )} */}
               <form onSubmit={handleSearchSubmit} className="lb-side-search">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Keyword, title, tag..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" aria-label="Search">
                    <i className="bi bi-search" />
                  </button>
                </form>
            </div>

            {/* Grid content */}
            {loading ? (
              <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading ads...</span>
                </div>
                <p className="text-muted mt-3">Fetching listings, please wait...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5 my-5 bg-light rounded-4 border p-4">
                <i className="bi bi-inbox display-4 text-muted mb-3 d-block" />
                <h3 className="h5 fw-bold text-dark mb-2">No ad listings found</h3>
                <p className="text-muted small mb-4">
                  We couldn&apos;t find any ads matching your current filter criteria.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="btn btn-outline-primary px-4 rounded-pill"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                {posts.map((item) => (
                  <div className="col" key={item.id}>
                    <Link
                      href={`/listings/${item.id}`}
                      className="text-decoration-none d-block h-100"
                    >
                      <article className="lb-card h-100 shadow-sm d-flex flex-column transition-all">
                        <div
                          className="lb-card-img position-relative"
                          style={{ height: 210, overflow: "hidden" }}
                        >
                          <img
                            src={item.image || "/ads/minimalist-fb-ad.png"}
                            alt={item.title}
                            loading="lazy"
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                          {item.banner && (
                            <span
                              className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white"
                              style={{ fontSize: "0.7rem", backdropFilter: "blur(4px)" }}
                            >
                              {item.banner}
                            </span>
                          )}
                        </div>

                        <div className="lb-card-body d-flex flex-column flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="badge bg-light text-dark border">
                              <i className="bi bi-calendar3 me-1 text-muted" />
                              {item.fromDate || "Active"}
                            </span>
                            {item.emotion && (
                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                {item.emotion}
                              </span>
                            )}
                          </div>

                          <h3 className="lb-card-title mb-2">
                            <span
                              className="d-inline-block text-truncate w-100"
                              title={item.title}
                            >
                              {item.title}
                            </span>
                          </h3>

                            <p className="lb-meta mb-3">
                              {item.address ? (
                                <span className="text-truncate d-inline-block text-muted small w-100">
                                  <i className="bi bi-geo-alt me-1 text-primary" /> {item.address}
                                </span>
                              ) : (
                                <span className="text-muted small">
                                  <i className="bi bi-geo-alt me-1" /> Gujarat
                                </span>
                              )}
                            </p>

                          <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                            <span className="lb-chip">
                              {item.searchCategory || item.searchGroup || "Listing Ad"}
                            </span>
                            <span
                              className="text-muted small text-truncate"
                              style={{ maxWidth: 120 }}
                            >
                              {item.contactPerson || "TinyAdds"}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <nav aria-label="Listings pagination" className="mt-5">
                <ul className="pagination lb-pagination justify-content-center flex-wrap">
                  <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                    {currentPage === 1 ? (
                      <span className="page-link" aria-label="Previous page">
                        <i className="bi bi-chevron-left" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => updateParams({ page: currentPage - 1 })}
                        aria-label="Previous page"
                      >
                        <i className="bi bi-chevron-left" />
                      </button>
                    )}
                  </li>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                    <li
                      key={num}
                      className={`page-item${num === currentPage ? " active" : ""}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => updateParams({ page: num })}
                        aria-current={num === currentPage ? "page" : undefined}
                      >
                        {num}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                    {currentPage === totalPages ? (
                      <span className="page-link" aria-label="Next page">
                        <i className="bi bi-chevron-right" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => updateParams({ page: currentPage + 1 })}
                        aria-label="Next page"
                      >
                        <i className="bi bi-chevron-right" />
                      </button>
                    )}
                  </li>
                </ul>
              </nav>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

export default function ListingsPage() {
  return (
    <main>
      <PageBanner
        title="Explore All Ad Listings"
        crumbs={[{ label: "Home", href: "/" }, { label: "Listings" }]}
      />
      <Suspense
        fallback={
          <div className="container py-5 text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading listings...</span>
            </div>
          </div>
        }
      >
        <ListingsContent />
      </Suspense>
    </main>
  );
}
