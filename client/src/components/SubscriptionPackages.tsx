"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoadingIndicator from "@/components/LoadingIndicator";
import { getPublicPackages } from "@/lib/packageApi";
import type { PublicPackageResponse } from "@/src/types/package";

export default function SubscriptionPackages() {
  const [packages, setPackages] = useState<PublicPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getPublicPackages(1, 100).then(({ data }) => {
      if (active) setPackages(data);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load packages");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <main className="lb-packages-page">
      <section className="lb-section lb-packages-section">
        <div className="container">
          <div className="lb-packages-heading text-center">
            <span className="lb-badge">Plans for growing businesses</span>
            <h1>Subscription Packages</h1>
            <p>Pick the package that fits your business and reach more customers on TinyAdds.</p>
          </div>

          {loading && <div className="d-flex justify-content-center py-5" role="status" aria-live="polite"><LoadingIndicator label="Loading subscription packages" /></div>}
          {!loading && error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
          {!loading && !error && packages.length === 0 && (
            <div className="lb-packages-empty text-center" role="status">
              <i className="bi bi-box-seam" aria-hidden="true" />
              <h2>No packages are available yet</h2>
              <p>Check back soon for subscription options.</p>
            </div>
          )}

          {!loading && !error && packages.length > 0 && (
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 align-items-stretch">
              {packages.map((pkg, index) => (
                <div className="col" key={pkg._id}>
                  <article className={`lb-package-card${pkg.isPopular ? " is-popular" : ""}`} style={{ animationDelay: `${index * 80}ms` }}>
                    {pkg.isPopular && <span className="lb-package-popular">Most popular</span>}
                    <div className="lb-package-topline">
                      <span className="lb-package-icon"><i className="bi bi-layers" aria-hidden="true" /></span>
                      <span className="lb-package-cycle">{pkg.period === "year" ? "Annual plan" : "Monthly plan"}</span>
                    </div>
                    <h2>{pkg.name}</h2>
                    <p className="lb-package-listing-count">{pkg.listingLimit} ad listings included</p>
                    <div className="lb-package-price">
                      <span className="lb-package-currency">₹</span>
                      <span>{pkg.price.toLocaleString("en-IN")}</span>
                      <small>/{pkg.period}</small>
                    </div>
                    <div className="lb-package-divider" />
                    <ul className="lb-package-features">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={`${pkg._id}-${featureIndex}`}><i className="bi bi-check2-circle" aria-hidden="true" />{feature}</li>
                      ))}
                    </ul>
                    <Link href="/register" className={`btn ${pkg.isPopular ? "lb-btn-primary" : "lb-btn-soft"}`}>
                      Get started <i className="bi bi-arrow-up-right ms-1" aria-hidden="true" />
                    </Link>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
