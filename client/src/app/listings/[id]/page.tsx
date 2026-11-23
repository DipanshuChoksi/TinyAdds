"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import PageBanner from "@/components/PageBanner";
import { getPublicPostById, type PublicPost } from "@/lib/postApi";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";

  const [post, setPost] = useState<PublicPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    getPublicPostById(id)
      .then((res) => {
        if (!active) return;
        if (res?.success && res.data) {
          setPost(res.data);
        } else {
          setError(res?.error?.message || "Listing not found");
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to fetch listing:", err);
        setError("Failed to load listing details");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main>
        <PageBanner
          title="Ad Listing Details"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Listings", href: "/listings" },
            { label: "Details" },
          ]}
        />
        <div className="container py-5 text-center my-5" role="status" aria-live="polite">
          <LoadingIndicator label="Loading ad details" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <PageBanner
          title="Listing Not Found"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Listings", href: "/listings" },
            { label: "Not Found" },
          ]}
        />
        <div className="container py-5 my-5 text-center">
          <div className="bg-light rounded-4 border p-5 max-w-md mx-auto" style={{ maxWidth: 500 }}>
            <i className="bi bi-exclamation-circle text-danger display-3 mb-3 d-block" />
            <h2 className="h4 fw-bold text-dark mb-2">Listing Unavailable</h2>
            <p className="text-muted small mb-4">
              {error || "The ad listing you are looking for does not exist or has expired."}
            </p>
            <Link href="/listings" className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-arrow-left me-2" /> Back to All Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <PageBanner
        title={post.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Listings", href: "/listings" },
          { label: post.title },
        ]}
      />

      <section className="lb-section py-5">
        <div className="container">
          {/* Back button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            >
              <i className="bi bi-arrow-left me-1" /> Back
            </button>
          </div>

          <div className="row g-4 g-lg-5">
            {/* Main content column */}
            <div className="col-lg-8">
              <div className="bg-white border rounded-4 overflow-hidden p-4 shadow-sm">
                {/* Ad Image / Banner */}
                <div
                  className="rounded-3 overflow-hidden position-relative mb-4 bg-light text-center"
                  style={{ maxHeight: 500 }}
                >
                  <img
                    src={post.image || "/ads/minimalist-fb-ad.png"}
                    alt={post.title}
                    className="w-100 h-auto"
                    style={{ objectFit: "contain", maxHeight: 500 }}
                  />
                  {/* {post.banner && (
                    <span
                      className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 text-white py-2 px-3"
                      style={{ fontSize: "0.85rem", backdropFilter: "blur(4px)" }}
                    >
                      {post.banner.name}
                    </span>
                  )} */}
                </div>

                {/* Key Tags and Badges */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  {post.emotion && (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle py-2 px-3 fs-6">
                      <i className="bi bi-emoji-smile me-1" /> {post.emotion.name}
                    </span>
                  )}
                  {post.searchGroup && (
                    <span className="badge bg-light text-dark border py-2 px-3 fs-6">
                      <i className="bi bi-folder2-open me-1 text-primary" /> Group: {post.searchGroup.name}
                    </span>
                  )}
                  {/* {post.searchCategory && (
                    <span className="badge bg-light text-dark border py-2 px-3 fs-6">
                      <i className="bi bi-tag me-1 text-primary" /> Category: {post.searchCategory}
                    </span>
                  )} */}
                  {post.fromDate && (
                    <span className="badge bg-light text-dark border py-2 px-3 fs-6">
                      <i className="bi bi-calendar3 me-1 text-primary" /> Available From: {post.fromDate}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="h2 fw-bold text-dark mb-4">{post.title}</h1>

                {/* Tag Pills */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-muted text-uppercase small fw-bold mb-2">Tags</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {post.tags
                        .map((t) => (typeof t === "object" && t !== null && "name" in t ? t.name : String(t)))
                        .filter(Boolean)
                        .map((tagName, idx) => (
                          <span key={idx} className="badge bg-light text-secondary border px-3 py-2">
                            #{tagName}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mt-4 pt-3 border-top">
                  <h4 className="h5 fw-bold text-dark mb-3">Ad Description</h4>
                  {post.description ? (
                    <div
                      className="lb-article-content text-secondary lh-lg"
                      dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                  ) : (
                    <p className="text-muted fst-italic">No additional description provided.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar column: Contact & Ad Details */}
            <div className="col-lg-4">
              <div className="lb-side">
                {/* Contact Information Card */}
                <div className="lb-side-box">
                  <h3 className="lb-side-title">Contact Advertiser</h3>

                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div
                      className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-4 flex-shrink-0"
                      style={{ width: 56, height: 56 }}
                    >
                      {post.contactPerson ? post.contactPerson.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h4 className="h6 fw-bold mb-0 text-dark">
                        {post.contactPerson || "Verified Advertiser"}
                      </h4>
                      <span className="text-muted small">Ad Host / Publisher</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {post.contactNo && (
                      <a
                        href={`tel:${post.contactNo}`}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill fw-semibold shadow-sm"
                      >
                        <i className="bi bi-telephone-fill" /> Call {post.contactNo}
                      </a>
                    )}

                    {post.email && (
                      <a
                        href={`mailto:${post.email}?subject=Inquiry regarding: ${encodeURIComponent(post.title)}`}
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill fw-semibold"
                      >
                        <i className="bi bi-envelope-fill" /> Email Advertiser
                      </a>
                    )}
                  </div>
                </div>

                {/* Ad Overview Meta Card */}
                <div className="lb-side-box">
                  <h3 className="lb-side-title">Listing Details</h3>
                  <table className="table table-borderless table-sm small mb-0">
                    <tbody>
                      <tr>
                        {/* <td className="text-muted py-2">Reference ID:</td> */}
                        {/* <td className="fw-semibold text-end text-dark font-monospace py-2">
                          {post.id.slice(0, 10)}...
                        </td> */}
                      </tr>
                      {/* {post.banner && (
                        <tr>
                          <td className="text-muted py-2">Banner Type:</td>
                          <td className="fw-semibold text-end text-dark py-2">{post.banner.name}</td>
                        </tr>
                      )} */}
                      {post.searchGroup && (
                        <tr>
                          <td className="text-muted py-2">Group:</td>
                          <td className="fw-semibold text-end text-dark py-2">{post.searchGroup.name}</td>
                        </tr>
                      )}
                      {/* {post.searchCategory && (
                        <tr>
                          <td className="text-muted py-2">Category:</td>
                          <td className="fw-semibold text-end text-dark py-2">{post.searchCategory}</td>
                        </tr>
                      )} */}
                      {post.emotion && (
                        <tr>
                          <td className="text-muted py-2">Emotion / Mood:</td>
                          <td className="fw-semibold text-end text-dark py-2">{post.emotion.name}</td>
                        </tr>
                      )}
                      {post.fromDate && (
                        <tr>
                          <td className="text-muted py-2">Active Since:</td>
                          <td className="fw-semibold text-end text-dark py-2">{post.fromDate}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
