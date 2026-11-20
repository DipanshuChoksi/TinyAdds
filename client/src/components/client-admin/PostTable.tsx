"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClientPost } from "@/types";
import { useConfirm, useToast } from "@/components/ui/UiProvider";
import http from "@/lib/http";
import LoadingIndicator from "@/components/LoadingIndicator";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 10;
type SortField = "title" | "fromDate" | "createdAt" | "status";

interface Props {
  mode?: "client" | "admin";
  onEdit?: (post: ClientPost) => void;
  title?: React.ReactNode;
}

function descriptionText(html: string): string {
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ?? "";
}

// Helper to ensure both dates are formatted identically
function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    // Appending T00:00:00 ensures YYYY-MM-DD strings don't shift timezone days
    const safeDateString = dateString.includes("T") ? dateString : `${dateString}T00:00:00`;
    const date = new Date(safeDateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export default function PostTable({ mode = "client", onEdit, title }: Props = {}) {
  const isAdmin = mode === "admin";
  const confirm = useConfirm();
  const toast = useToast();
  const endpoint = isAdmin ? "/admin/posts" : "/client/posts";
  const [posts, setPosts] = useState<ClientPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ClientPost | null>(null);
  const [rejectPost, setRejectPost] = useState<ClientPost | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    http.get<ClientPost[]>(endpoint, { params: { page, limit: PAGE_SIZE, search, sortBy, sortDirection } }).then(({ data, meta }) => {
      if (!active) return;
      setPosts(data);
      setTotalPages(meta?.totalPages ?? 1);
    }).catch((error: unknown) => {
      if (active) toast.error(error instanceof Error ? error.message : "Unable to load posts");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [endpoint, page, reload, search, sortBy, sortDirection, toast]);

  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  const handleDelete = async (post: ClientPost) => {
    const ok = await confirm({
      title: "Delete Post?",
      message: "This post will be removed from your account.",
      icon: "bi-trash3-fill",
      variant: "danger",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;
    try {
      await http.delete(`/client/posts/${encodeURIComponent(post.id)}`);
      if (posts.length === 1 && page > 1) setPage((current) => current - 1);
      else setReload((current) => current + 1);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete post");
    }
  };

  const handleStatusToggle = async (post: ClientPost) => {
    const status = post.status === "approved" ? "pending" : "approved";
    setStatusUpdating(true);
    try {
      const { data } = await http.patch<ClientPost, { status: string }>(`/admin/posts/${encodeURIComponent(post.id)}/status`, { status });
      setPosts((items) => items.map((item) => item.id === post.id ? data : item));
      setSelectedPost((current) => (current && current.id === post.id ? data : current));
      toast.success(status === "approved" ? "Post approved" : "Post moved to pending");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update post status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDirection((current) => current === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setPage(1);
  };

  const sortHeader = (label: string, field: SortField) => (
    <button type="button" className="btn btn-link p-0 text-reset text-decoration-none fw-bold" onClick={() => toggleSort(field)} aria-label={`Sort by ${label}`}>
      {label}<i className={`bi ms-1 ${sortBy === field ? sortDirection === "asc" ? "bi-arrow-up" : "bi-arrow-down" : "bi-arrow-down-up"}`} aria-hidden="true" />
    </button>
  );

  const handleReject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rejectPost || !rejectionComment.trim()) {
      toast.error("Add a rejection comment first");
      return;
    }
    setRejecting(true);
    try {
      const { data } = await http.patch<ClientPost, { status: string; rejectionComment: string }>(
        `/admin/posts/${encodeURIComponent(rejectPost.id)}/status`,
        { status: "rejected", rejectionComment: rejectionComment.trim() }
      );
      setPosts((items) => items.map((item) => item.id === rejectPost.id ? data : item));
      setSelectedPost((current) => (current && current.id === rejectPost.id ? data : current));
      setRejectPost(null);
      setRejectionComment("");
      toast.success("Post rejected and feedback saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reject post");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div>
      <div className={`d-flex ${title ? "justify-content-between align-items-center" : "justify-content-end"} mb-3 flex-wrap gap-2`}>
        <div className="input-group" style={{ maxWidth: 320 }}>
          <input type="search" className="form-control border-end-0" placeholder="Search posts" aria-label="Search posts" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          <span className="input-group-text bg-white border-start-0 text-muted"><i className="bi bi-search" aria-hidden="true" /></span>
        </div>
      </div>
      <div className="table-responsive">
        <table className="lb-ca-table">
        <thead>
          <tr><th>{sortHeader("Title Name", "title")}</th><th>Image</th><th>{sortHeader("From Date", "fromDate")}</th><th>{sortHeader("Created", "createdAt")}</th><th>{sortHeader("Status", "status")}</th><th>Admin Feedback</th><th>Action</th></tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="fw-semibold">{post.title}</td>
              <td>
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.title} className="lb-ca-thumb" loading="lazy" />
                ) : (
                  <span className="lb-ca-thumb lb-ca-thumb-empty"><i className="bi bi-image"></i></span>
                )}
              </td>
              {/* Updated fromDate format */}
              <td className="fw-bold">{formatDate(post.fromDate)}</td>
              {/* Updated createdAt format */}
              <td className="fw-bold">{formatDate(post.createdAt)}</td>
              <td>
                <span className={`badge rounded-pill ${post.status === "approved" ? "text-bg-success" : post.status === "rejected" ? "text-bg-danger" : "text-bg-secondary"}`}>{post.status ?? "pending"}</span>
              </td>
              <td className="text-break" style={{ maxWidth: 280, whiteSpace: "pre-wrap" }}>{post.rejectionComment || "-"}</td>
              <td className="text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-secondary me-1" title="View post" aria-label={`View ${post.title}`} onClick={() => setSelectedPost(post)}><i className="bi bi-eye" aria-hidden="true" /></button>
                {isAdmin ? <>
                  <button type="button" className="btn btn-sm btn-outline-primary me-1" title="Edit post" aria-label={`Edit ${post.title}`} onClick={() => onEdit?.(post)}><i className="bi bi-pencil-square" aria-hidden="true" /></button>
                  <button type="button" className="btn btn-sm btn-outline-danger" title="Reject post" aria-label={`Reject ${post.title}`} onClick={() => { setRejectPost(post); setRejectionComment(""); }}><i className="bi bi-x-circle" aria-hidden="true" /></button>
                </> : <>
                  <Link href={`/client-admin/add-post?edit=${encodeURIComponent(post.id)}`} className="btn btn-sm btn-outline-primary me-1" title="Edit post" aria-label={`Edit ${post.title}`}><i className="bi bi-pencil-square" aria-hidden="true" /></Link>
                  <button type="button" className="btn btn-sm btn-outline-danger" title="Delete post" aria-label={`Delete ${post.title}`} onClick={() => handleDelete(post)}><i className="bi bi-trash3" aria-hidden="true" /></button>
                </>}
              </td>
            </tr>
          ))}
          {!loading && posts.length === 0 && <tr><td colSpan={7} className="py-5">No posts found.</td></tr>}
          {loading && <tr><td colSpan={7} className="py-4 text-center"><div className="d-inline-flex flex-column align-items-center" role="status" aria-live="polite"><LoadingIndicator label="Loading posts" compact /></div></td></tr>}
        </tbody>
      </table>
      </div>
      {totalPages > 1 && (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-4">
          <span className="small text-muted" aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
            ariaLabel="Post pages"
          />
        </div>
      )}
      {selectedPost && <div className="modal d-block" role="dialog" aria-modal="true" aria-label={`Post details: ${selectedPost.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPost(null); }} style={{ backgroundColor: "rgba(15, 23, 42, 0.45)", zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content border-0 shadow rounded-3">
            <div className="modal-header">
              <h2 className="modal-title fs-5">{selectedPost.title}</h2>
              <button type="button" className="btn-close" aria-label="Close details" onClick={() => setSelectedPost(null)} />
            </div>
            <div className="modal-body">
              {selectedPost.image && <div className="mb-4 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedPost.image} alt={selectedPost.title} className="img-fluid rounded-3" style={{ maxHeight: 260, objectFit: "contain" }} />
              </div>}
              <dl className="row gy-2 mb-0">
                <dt className="col-sm-4 text-body-secondary">Contact person</dt><dd className="col-sm-8 mb-2">{selectedPost.contactPerson || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Contact number</dt><dd className="col-sm-8 mb-2">{selectedPost.contactNo || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Email</dt><dd className="col-sm-8 mb-2 text-break">{selectedPost.email || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Address</dt><dd className="col-sm-8 mb-2">{selectedPost.address || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Available from</dt><dd className="col-sm-8 mb-2">{formatDate(selectedPost.fromDate)}</dd>
                <dt className="col-sm-4 text-body-secondary">Banner section</dt><dd className="col-sm-8 mb-2">{selectedPost.banner.name || "-"}</dd>
              {(() => {
                const isListingAds = selectedPost.banner.slug === "listing-ads";
                return isListingAds ? (
                  <>
                    <dt className="col-sm-4 text-body-secondary">Emotion</dt>
                    <dd className="col-sm-8 mb-2">{selectedPost.emotion.name || "-"}</dd>
                    <dt className="col-sm-4 text-body-secondary">Search group</dt>
                    <dd className="col-sm-8 mb-2">{selectedPost.searchGroup.name || "-"}</dd>
                  </>
                ) : null;
              })()}
                <dt className="col-sm-4 text-body-secondary">Tags</dt>
                <dd className="col-sm-8 mb-2">
                  {Array.isArray(selectedPost.tags) && selectedPost.tags.length > 0
                    ? selectedPost.tags
                        .map((t) => (typeof t === "object" && t !== null && "name" in t ? t.name : String(t)))
                        .join(", ")
                    : "-"}
                </dd>
                <dt className="col-sm-4 text-body-secondary">Created</dt><dd className="col-sm-8 mb-2">{formatDate(selectedPost.createdAt)}</dd>
                <dt className="col-sm-4 text-body-secondary">Status</dt>
                <dd className="col-sm-8 mb-2">
                  <span
                    className={`badge rounded-pill text-uppercase ${
                      selectedPost.status === "approved"
                        ? "text-bg-success"
                        : selectedPost.status === "rejected"
                        ? "text-bg-danger"
                        : "text-bg-secondary"
                    }`}
                  >
                    {selectedPost.status ?? "pending"}
                  </span>
                </dd>
                {selectedPost.rejectionComment && <><dt className="col-sm-4 text-body-secondary">Admin feedback</dt><dd className="col-sm-8 mb-2 text-break">{selectedPost.rejectionComment}</dd></>}
                <dt className="col-sm-4 text-body-secondary">Description</dt><dd className="col-sm-8 mb-0 text-break" style={{ whiteSpace: "pre-wrap" }}>{descriptionText(selectedPost.description) || "-"}</dd>
              </dl>
            </div>
            <div className="modal-footer">
              {isAdmin && (
                <button
                  type="button"
                  className={`btn me-auto ${selectedPost.status === "approved" ? "btn-outline-secondary" : "btn-success"}`}
                  disabled={statusUpdating || selectedPost.status === "rejected"}
                  title={selectedPost.status === "rejected" ? "Rejected posts cannot be toggled" : undefined}
                  onClick={() => handleStatusToggle(selectedPost)}
                >
                  {statusUpdating
                    ? "Updating..."
                    : selectedPost.status === "approved"
                    ? "Move to pending"
                    : "Approve post"}
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedPost(null)}>Close</button>
            </div>
          </div>
        </div>
      </div>}
      {rejectPost && <div className="modal d-block" role="dialog" aria-modal="true" aria-label={`Reject ${rejectPost.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget && !rejecting) setRejectPost(null); }} style={{ backgroundColor: "rgba(15, 23, 42, 0.45)", zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content border-0 shadow rounded-3" onSubmit={handleReject}>
            <div className="modal-header"><h2 className="modal-title fs-5">Reject post</h2><button type="button" className="btn-close" aria-label="Close" disabled={rejecting} onClick={() => setRejectPost(null)} /></div>
            <div className="modal-body">
              <p className="mb-2">{rejectPost.title}</p>
              <label className="form-label" htmlFor="rejection-comment">Reason for rejection</label>
              <textarea id="rejection-comment" className="form-control" rows={4} maxLength={2000} required value={rejectionComment} onChange={(event) => setRejectionComment(event.target.value)} />
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-outline-secondary" disabled={rejecting} onClick={() => setRejectPost(null)}>Cancel</button><button type="submit" className="btn btn-danger" disabled={rejecting || !rejectionComment.trim()}>{rejecting ? "Rejecting..." : "Reject post"}</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
}