"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClientPost } from "@/types";
import { useConfirm, useToast } from "@/components/ui/UiProvider";
import http from "@/lib/http";
import LoadingIndicator from "@/components/LoadingIndicator";

const PAGE_SIZE = 10;
type SortField = "title" | "fromDate" | "createdAt" | "status";

interface Props {
  mode?: "client" | "admin";
  onEdit?: (post: ClientPost) => void;
}

function descriptionText(html: string): string {
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ?? "";
}

export default function PostTable({ mode = "client", onEdit }: Props = {}) {
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
    try {
      const { data } = await http.patch<ClientPost, { status: string }>(`/admin/posts/${encodeURIComponent(post.id)}/status`, { status });
      setPosts((items) => items.map((item) => item.id === post.id ? data : item));
      toast.success(status === "approved" ? "Post approved" : "Post moved to pending");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update post status");
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
    <div className="table-responsive">
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text bg-white"><i className="bi bi-search" aria-hidden="true" /></span>
          <input type="search" className="form-control" placeholder="Search posts" aria-label="Search posts" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
        </div>
      </div>
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
              <td className="fw-bold">{post.fromDate || "-"}</td>
              <td className="fw-bold">{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                {isAdmin ? <button type="button" className={`badge rounded-pill border-0 ${post.status === "approved" ? "text-bg-success" : post.status === "rejected" ? "text-bg-danger" : "text-bg-secondary"}`} aria-pressed={post.status === "approved"} title="Toggle approved / pending" onClick={() => handleStatusToggle(post)}><i className={`bi ${post.status === "approved" ? "bi-toggle-on" : "bi-toggle-off"} me-1`} aria-hidden="true" />{post.status ?? "pending"}</button>
                  : <span className={`badge rounded-pill ${post.status === "approved" ? "text-bg-success" : post.status === "rejected" ? "text-bg-danger" : "text-bg-secondary"}`}>{post.status ?? "pending"}</span>}
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
      {totalPages > 1 && <nav className="d-flex justify-content-end align-items-center gap-2 mt-3" aria-label="Post pages">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</button>
        <span aria-live="polite">Page {page} of {totalPages}</span>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>Next</button>
      </nav>}
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
                <dt className="col-sm-4 text-body-secondary">Available from</dt><dd className="col-sm-8 mb-2">{selectedPost.fromDate || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Banner section</dt><dd className="col-sm-8 mb-2">{selectedPost.banner || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Emotion</dt><dd className="col-sm-8 mb-2">{selectedPost.emotion || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Search group</dt><dd className="col-sm-8 mb-2">{selectedPost.searchGroup || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Search category</dt><dd className="col-sm-8 mb-2">{selectedPost.searchCategory || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Tag</dt><dd className="col-sm-8 mb-2">{selectedPost.tag || "-"}</dd>
                <dt className="col-sm-4 text-body-secondary">Created</dt><dd className="col-sm-8 mb-2">{new Date(selectedPost.createdAt).toLocaleString()}</dd>
                <dt className="col-sm-4 text-body-secondary">Status</dt><dd className="col-sm-8 mb-2">{selectedPost.status ?? "pending"}</dd>
                {selectedPost.rejectionComment && <><dt className="col-sm-4 text-body-secondary">Admin feedback</dt><dd className="col-sm-8 mb-2 text-break">{selectedPost.rejectionComment}</dd></>}
                <dt className="col-sm-4 text-body-secondary">Description</dt><dd className="col-sm-8 mb-0 text-break" style={{ whiteSpace: "pre-wrap" }}>{descriptionText(selectedPost.description) || "-"}</dd>
              </dl>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setSelectedPost(null)}>Close</button></div>
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
