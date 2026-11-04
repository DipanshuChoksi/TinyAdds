"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClientPost } from "@/types";
import { useConfirm, useToast } from "@/components/ui/UiProvider";
import http from "@/lib/http";

const PAGE_SIZE = 10;

function descriptionText(html: string): string {
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ?? "";
}

export default function PostTable() {
  const confirm = useConfirm();
  const toast = useToast();
  const [posts, setPosts] = useState<ClientPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [selectedPost, setSelectedPost] = useState<ClientPost | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    http.get<ClientPost[]>("/client/posts", { params: { page, limit: PAGE_SIZE } }).then(({ data, meta }) => {
      if (!active) return;
      setPosts(data);
      setTotalPages(meta?.totalPages ?? 1);
    }).catch((error: unknown) => {
      if (active) toast.error(error instanceof Error ? error.message : "Unable to load posts");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [page, reload, toast]);

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

  return (
    <div className="table-responsive">
      <table className="lb-ca-table">
        <thead>
          <tr><th>Title Name</th><th>Image</th><th>From Date</th><th>Created</th><th>Action</th></tr>
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
              <td className="text-nowrap">
                <button type="button" className="btn btn-sm btn-outline-secondary me-1" title="View post" aria-label={`View ${post.title}`} onClick={() => setSelectedPost(post)}><i className="bi bi-eye" aria-hidden="true" /></button>
                <Link href={`/client-admin/add-post?edit=${encodeURIComponent(post.id)}`} className="btn btn-sm btn-outline-primary me-1" title="Edit post" aria-label={`Edit ${post.title}`}><i className="bi bi-pencil-square" aria-hidden="true" /></Link>
                <button type="button" className="btn btn-sm btn-outline-danger" title="Delete post" aria-label={`Delete ${post.title}`} onClick={() => handleDelete(post)}><i className="bi bi-trash3" aria-hidden="true" /></button>
              </td>
            </tr>
          ))}
          {!loading && posts.length === 0 && <tr><td colSpan={5} className="py-5">No posts found.</td></tr>}
          {loading && <tr><td colSpan={5} className="py-5 text-center">Loading posts...</td></tr>}
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
                <dt className="col-sm-4 text-body-secondary">Description</dt><dd className="col-sm-8 mb-0 text-break" style={{ whiteSpace: "pre-wrap" }}>{descriptionText(selectedPost.description) || "-"}</dd>
              </dl>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setSelectedPost(null)}>Close</button></div>
          </div>
        </div>
      </div>}
    </div>
  );
}
