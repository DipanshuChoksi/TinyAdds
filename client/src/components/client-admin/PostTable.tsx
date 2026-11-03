"use client";

import { useState } from "react";
import { CLIENT_POSTS, type ClientPost } from "@/data/clientAdmin";
import { useConfirm, useToast } from "@/components/ui/UiProvider";

export default function PostTable() {
  const confirm = useConfirm();
  const toast = useToast();
  const [posts, setPosts] = useState<ClientPost[]>(CLIENT_POSTS);

  const handleDelete = async (post: ClientPost) => {
    const ok = await confirm({
      title: "Delete Post?",
      message: "Your post will be permanently deleted and cannot be recovered.",
      icon: "bi-trash3-fill",
      variant: "danger",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;
    // TODO: call delete-post API here
    setPosts((list) => list.filter((p) => p.id !== post.id));
    toast.success("Post deleted successfully");
  };

  return (
    <div className="table-responsive">
      <table className="lb-ca-table">
        <thead>
          <tr><th>Title Name</th><th>Image</th><th>From Date</th><th>TO Date</th><th>Action</th></tr>
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
              <td className="fw-bold">{post.toDate || "-"}</td>
              <td><button type="button" className="btn lb-ca-del" onClick={() => handleDelete(post)}>Delete</button></td>
            </tr>
          ))}
          {posts.length === 0 && <tr><td colSpan={5} className="py-5">No posts found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
