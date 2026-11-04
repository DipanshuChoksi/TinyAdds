'use client';

import { useState } from 'react';
import AddPostForm from '@/components/client-admin/AddPostForm';
import PostTable from '@/components/client-admin/PostTable';
import type { ClientPost } from '@/types';

export default function PostApprovalView() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ClientPost | null>(null);
  const [tableVersion, setTableVersion] = useState(0);

  const openNewPostForm = () => {
    setEditingPost(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingPost(null);
    setFormOpen(false);
  };

  const handleSaved = () => {
    closeForm();
    setTableVersion((version) => version + 1);
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">Post Approval</h1>
          <p className="small text-body-secondary mb-0">Review, approve, or reject client posts.</p>
        </div>
        <button type="button" className="btn btn-dark" onClick={openNewPostForm}>
          <i className="bi bi-plus-lg me-2" aria-hidden="true" />Add Post
        </button>
      </div>

      {formOpen && <div className="mb-4">
        <AddPostForm
          key={editingPost?.id ?? 'new-admin-post'}
          mode="admin"
          postId={editingPost?.id}
          onSaved={handleSaved}
        />
        <div className="text-end mt-2">
          <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancel</button>
        </div>
      </div>}

      <PostTable
        key={tableVersion}
        mode="admin"
        onEdit={(post) => {
          setEditingPost(post);
          setFormOpen(true);
        }}
      />
    </div>
  );
}
