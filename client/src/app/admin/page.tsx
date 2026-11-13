'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getAdminMasterItems,
  getAdminPackages,
  getAdminPostApprovals,
  getBlogs,
} from '@/lib/api';
import type { AdminPostApproval, AdminPackage, BlogSummary } from '@/src/types';

export default function AdminDashboardPage() {
  const [approvals, setApprovals] = useState<AdminPostApproval[]>([]);
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      getAdminPostApprovals(),
      getBlogs(),
      getAdminPackages().catch(() => []),
      getAdminMasterItems().catch(() => []),
    ])
      .then(([approvalsData, blogsData, packagesData]) => {
        if (!active) return;
        setApprovals(approvalsData || []);
        setBlogs(blogsData || []);
        setPackages((packagesData as unknown as AdminPackage[]) || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;

  const STATS = [
    {
      title: 'Pending Inquiries',
      value: 0,
      icon: 'bi-envelope-paper',
      href: '/admin/inquire',
      label: 'Needs direct response',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      icon: 'bi-check2-circle',
      href: '/admin/post-approval',
      label: 'Awaiting moderation',
    },
    {
      title: 'Active Packages',
      value: packages.length,
      icon: 'bi-box-seam',
      href: '/admin/manage-package',
      label: 'Live monetization plans',
    },
    {
      title: 'Published Blogs',
      value: blogs.length,
      icon: 'bi-journal-richtext',
      href: '/admin/manage-blogs',
      label: 'Content articles',
    },
  ];

  return (
    <div>
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 tracking-tight" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="small mb-0" style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Monitor real-time contractor inquiries, post approvals, active monetization packages, and search trends.
          </p>
        </div>
        <div>
          <Link
            href="/admin/post-approval"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
          >
            <i className="bi bi-shield-check" />
            <span>Review Posts ({pendingApprovals})</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="row g-3 mb-4">
        {STATS.map((s) => (
          <div key={s.title} className="col-6 col-xl-3">
            <div className="admin-stat-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="small fw-medium" style={{ color: '#64748b', fontSize: '0.82rem', letterSpacing: '-0.01em' }}>
                    {s.title}
                  </span>
                  <div className="admin-stat-icon">
                    <i className={`bi ${s.icon}`} />
                  </div>
                </div>
                <div className="h3 fw-bold mb-1" style={{ color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {loading ? '...' : s.value}
                </div>
              </div>
              <div
                className="d-flex align-items-center justify-content-between mt-3 pt-2"
                style={{ borderTop: '1px solid #f8fafc' }}
              >
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {s.label}
                </span>
                <Link
                  href={s.href}
                  className="small fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
                  style={{ color: 'var(--lb-primary)', fontSize: '0.75rem' }}
                >
                  Manage <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
