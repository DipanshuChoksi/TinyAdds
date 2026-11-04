"use client";

import { useState } from "react";
import Link from "next/link";
import type { ClientPost } from "@/types";
import { useConfirm, useToast } from "@/components/ui/UiProvider";
import { useEffect } from "react";
import http from "@/lib/http";

const PAGE_SIZE = 10;

export default function PostTable() {
  const confirm = useConfirm();
  const toast = useToast();
  const [posts, setPosts] = useState<ClientPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

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
                <Link href={`/client-admin/add-post?edit=${encodeURIComponent(post.id)}`} className="btn btn-sm btn-outline-primary me-2" aria-label={`Edit ${post.title}`}>Edit</Link>
                <button type="button" className="btn lb-ca-del" onClick={() => handleDelete(post)}>Delete</button>
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
    </div>
  );
}
