"use client";

import { useEffect, useState, useTransition, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageBanner from "@/components/PageBanner";
import Pagination from "@/components/ui/Pagination";
import { getPublicPosts, type PublicPost } from "@/lib/postApi";
import { getPublicBannerSections } from "@/lib/bannerSectionApi";
import { getPublicGroups } from "@/lib/groupApi";
import { getPublicSearchCategories } from "@/lib/searchCategoryApi";
import { getPublicEmotions } from "@/lib/emotionApi";
import { getPublicCities } from "@/lib/cityApi";
import { getPublicTags } from "@/lib/tagApi";
import type { PublicCityResponse } from "@/types/city";
import type { PublicTagResponse } from "@/types/tag";

const PAGE_SIZE = 12;

type FilterOption = { id: string; name: string };

/** Resolve a possibly-populated ref (object with `name` or plain string) to a display string. */
function refName(
  ref: { name?: string } | string | null | undefined
): string | undefined {
  if (!ref) return undefined;
  if (typeof ref === "string") return ref;
  return ref.name;
}

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
  const tagsParam = searchParams.get("tags") || "";
  const cityIdParam = searchParams.get("cityId") || "";
  const cityId =
    cityIdParam && !isNaN(Number(cityIdParam)) ? Number(cityIdParam) : undefined;
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Local input state for the search bar (debounced / on submit)
  const [searchInput, setSearchInput] = useState(search);

  // Master dropdown options
  const [bannerOptions, setBannerOptions] = useState<FilterOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<FilterOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<FilterOption[]>([]);
  const [emotionOptions, setEmotionOptions] = useState<FilterOption[]>([]);
  const [cityOptions, setCityOptions] = useState<PublicCityResponse[]>([]);
  const [tagOptions, setTagOptions] = useState<PublicTagResponse[]>([]);

  // Tag filter modal state
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const selectedTagIds = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  const [pendingTagIds, setPendingTagIds] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState("");

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
      getPublicTags().catch(() => null),
    ]).then(([bannerRes, groupRes, catRes, emotionRes, cityRes, tagRes]) => {
      if (bannerRes?.success && Array.isArray(bannerRes.data)) {
        setBannerOptions(
          bannerRes.data
            .map((b) => ({ id: String(b._id), name: b.name }))
            .filter((b) => b.name)
        );
      }
      if (groupRes?.success && Array.isArray(groupRes.data)) {
        setGroupOptions(
          groupRes.data
            .map((g) => ({ id: String(g._id), name: g.name }))
            .filter((g) => g.name)
        );
      }
      if (catRes?.success && Array.isArray(catRes.data)) {
        setCategoryOptions(
          catRes.data
            .map((c) => ({ id: String(c._id), name: c.name }))
            .filter((c) => c.name)
        );
      }
      if (emotionRes?.success && Array.isArray(emotionRes.data)) {
        setEmotionOptions(
          emotionRes.data
            .map((e) => ({ id: String(e._id), name: e.name }))
            .filter((e) => e.name)
        );
      }
      if (cityRes?.success && Array.isArray(cityRes.data)) {
        setCityOptions(cityRes.data);
      }
      if (tagRes?.success && Array.isArray(tagRes.data)) {
        setTagOptions(tagRes.data);
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
      tags: tagsParam || undefined,
      cityId: cityId,
      page: currentPage,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        if (!active) return;
        if (res?.success && Array.isArray(res.data)) {
          setPosts(res.data);
          const meta = res.meta as
            | { total?: number; totalPages?: number }
            | undefined;
          setTotal(meta?.total || res.data.length);
          setTotalPages(
            meta?.totalPages ||
              Math.ceil((meta?.total || res.data.length) / PAGE_SIZE) ||
              1
          );
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
  }, [search, banner, group, category, emotion, tagsParam, cityId, currentPage]);

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

  const hasActiveFilters = Boolean(
    search || banner || group || category || emotion || tagsParam || cityId !== undefined
  );

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
                  <h3 className="lb-side-title mb-0 border-bottom-0 pb-0">
                    Filters
                  </h3>
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
                    onChange={(e) =>
                      updateParams({ banner: e.target.value, page: 1 })
                    }
                  >
                    <option value="">All Banner Types</option>
                    {bannerOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
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
                    onChange={(e) =>
                      updateParams({ group: e.target.value, page: 1 })
                    }
                  >
                    <option value="">All Groups</option>
                    {groupOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
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
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
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
                    onChange={(e) =>
                      updateParams({ cityId: e.target.value || null, page: 1 })
                    }
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
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted text-uppercase mb-1">
                    Emotion / Vibe
                  </label>
                  <select
                    className="form-select"
                    value={emotion}
                    onChange={(e) =>
                      updateParams({ emotion: e.target.value, page: 1 })
                    }
                  >
                    <option value="">All Emotions</option>
                    {emotionOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Filter Button & Selected Tag Pills */}
                <div className="mb-2">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label small fw-semibold text-muted text-uppercase mb-0">
                      Tags
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 py-1 px-2 rounded-pill"
                      style={{ fontSize: "0.78rem" }}
                      onClick={() => {
                        setPendingTagIds(selectedTagIds);
                        setTagSearchQuery("");
                        setTagModalOpen(true);
                      }}
                    >
                      <i className="bi bi-tag" />
                      <span>{selectedTagIds.length > 0 ? "Edit Tags" : "Select Tags"}</span>
                    </button>
                  </div>

                  {selectedTagIds.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {selectedTagIds.map((tid) => {
                        const tagObj = tagOptions.find((t) => t._id === tid);
                        const label = tagObj ? tagObj.name : tid;
                        return (
                          <span
                            key={tid}
                            className="badge d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                            style={{
                              backgroundColor: "rgba(184, 77, 40, 0.08)",
                              color: "var(--lb-primary, #b84d28)",
                              border: "1px solid rgba(184, 77, 40, 0.22)",
                              fontSize: "0.78rem",
                              fontWeight: 500,
                            }}
                          >
                            <span>#{label}</span>
                            <button
                              type="button"
                              className="btn-close p-0 ms-1"
                              style={{ fontSize: "0.55rem" }}
                              aria-label={`Remove tag ${label}`}
                              onClick={() => {
                                const next = selectedTagIds.filter((id) => id !== tid);
                                updateParams({ tags: next.length > 0 ? next.join(",") : null, page: 1 });
                              }}
                            />
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0 mt-1" style={{ fontSize: "0.8rem" }}>
                      No tags selected.
                    </p>
                  )}
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
              <div
                className="text-center py-5 my-5"
                role="status"
                aria-live="polite"
              >
                <LoadingIndicator label="Loading listings" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5 my-5 bg-light rounded-4 border p-4">
                <i className="bi bi-inbox display-4 text-muted mb-3 d-block" />
                <h3 className="h5 fw-bold text-dark mb-2">
                  No ad listings found
                </h3>
                <p className="text-muted small mb-4">
                  We couldn&apos;t find any ads matching your current filter
                  criteria.
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
                {posts.map((item) => {
                  const bannerName = refName(item.banner);
                  const emotionName = refName(item.emotion);
                  const categoryName = refName(item.searchCategory);
                  const groupName = refName(item.searchGroup);

                  return (
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
                            {bannerName && (
                              <span
                                className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white"
                                style={{
                                  fontSize: "0.7rem",
                                  backdropFilter: "blur(4px)",
                                }}
                              >
                                {bannerName}
                              </span>
                            )}
                          </div>

                          <div className="lb-card-body d-flex flex-column flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-calendar3 me-1 text-muted" />
                                {item.fromDate || "Active"}
                              </span>
                              {emotionName && (
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                  {emotionName}
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
                                  <i className="bi bi-geo-alt me-1 text-primary" />{" "}
                                  {item.address}
                                </span>
                              ) : (
                                <span className="text-muted small">
                                  <i className="bi bi-geo-alt me-1" /> Gujarat
                                </span>
                              )}
                            </p>

                            <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                              <span className="lb-chip">
                                {categoryName || groupName || "Listing Ad"}
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
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParams({ page })}
                ariaLabel="Listings pagination"
                className="mt-5"
              />
            )}
          </main>
        </div>
      </div>

      {/* Tags Filter Modal */}
      {tagModalOpen && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 1060,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setTagModalOpen(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-bottom bg-light px-4 py-3 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="modal-title fw-bold mb-0 text-dark">
                    <i className="bi bi-tags me-2 text-primary" />
                    Filter by Tags
                  </h6>
                  <small className="text-muted">
                    Select one or more tags to refine ad listings
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setTagModalOpen(false)}
                />
              </div>

              <div className="modal-body p-4">
                {/* Search tags inside modal */}
                <div className="position-relative mb-3">
                  <i
                    className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: "#94a3b8" }}
                  />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search tags..."
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {tagSearchQuery && (
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                      style={{ color: "#94a3b8" }}
                      onClick={() => setTagSearchQuery("")}
                    >
                      <i className="bi bi-x-circle-fill" />
                    </button>
                  )}
                </div>

                {/* Selected Count & Select/Deselect All buttons */}
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <span className="small text-muted">
                    <strong>{pendingTagIds.length}</strong> tag
                    {pendingTagIds.length === 1 ? "" : "s"} selected
                  </span>
                  <div className="d-flex gap-2">
                    {pendingTagIds.length > 0 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => setPendingTagIds([])}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags Grid / List */}
                <div
                  className="d-flex flex-wrap gap-2"
                  style={{ maxHeight: "280px", overflowY: "auto" }}
                >
                  {(() => {
                    const filtered = tagOptions.filter((t) =>
                      tagSearchQuery.trim()
                        ? t.name.toLowerCase().includes(tagSearchQuery.trim().toLowerCase())
                        : true
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="w-100 text-center py-4 text-muted small">
                          <i className="bi bi-tag fs-3 d-block mb-1 text-secondary" />
                          No tags match &ldquo;{tagSearchQuery}&rdquo;
                        </div>
                      );
                    }

                    return filtered.map((t) => {
                      const isSelected = pendingTagIds.includes(t._id);
                      return (
                        <button
                          key={t._id}
                          type="button"
                          className="btn btn-sm rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1 text-start"
                          style={{
                            fontSize: "0.84rem",
                            backgroundColor: isSelected
                              ? "rgba(184, 77, 40, 0.12)"
                              : "var(--lb-soft, #f8f6f4)",
                            color: isSelected
                              ? "var(--lb-primary, #b84d28)"
                              : "var(--lb-ink, #2d2621)",
                            border: isSelected
                              ? "1.5px solid var(--lb-primary, #b84d28)"
                              : "1px solid var(--lb-line, #eadfd7)",
                            fontWeight: isSelected ? 600 : 400,
                            transition: "all 0.15s ease",
                          }}
                          onClick={() => {
                            if (isSelected) {
                              setPendingTagIds(pendingTagIds.filter((id) => id !== t._id));
                            } else {
                              setPendingTagIds([...pendingTagIds, t._id]);
                            }
                          }}
                        >
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: "14px",
                              height: "14px",
                              backgroundColor: isSelected
                                ? "var(--lb-primary, #b84d28)"
                                : "transparent",
                              color: "#fff",
                              fontSize: "0.6rem",
                            }}
                          >
                            {isSelected && <i className="bi bi-check" />}
                          </span>
                          <span>{t.name}</span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  onClick={() => setTagModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary text-white rounded-pill px-4"
                  style={{ backgroundColor: "var(--lb-primary)" }}
                  onClick={() => {
                    setTagModalOpen(false);
                    updateParams({
                      tags: pendingTagIds.length > 0 ? pendingTagIds.join(",") : null,
                      page: 1,
                    });
                  }}
                >
                  Apply Filter {pendingTagIds.length > 0 ? `(${pendingTagIds.length})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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