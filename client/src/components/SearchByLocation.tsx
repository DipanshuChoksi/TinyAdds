"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicCities } from "@/lib/cityApi";
import type { PublicCityResponse } from "@/types/city";

export default function SearchByLocation() {
  const [cities, setCities] = useState<PublicCityResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Fetch active cities with showOnHome = true
    getPublicCities(undefined, undefined, 1, 20, true)
      .then((res) => {
        if (!active) return;
        if (res?.success && Array.isArray(res.data)) {
          setCities(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load featured cities:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="lb-section">
        <div className="container">
          <div className="lb-head d-flex flex-wrap align-items-end justify-content-between gap-3">
            <div>
              <span className="lb-badge">Search by location</span>
              <h2>Search by location</h2>
            </div>
          </div>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="loc-asia" role="tabpanel">
              {loading ? (
                <div className="text-center py-5 text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status" />
                  Loading locations...
                </div>
              ) : cities.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-geo-alt fs-2 d-block mb-2 text-secondary" />
                  No featured locations available.
                </div>
              ) : (
                <div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 g-lg-4">
                  {cities.map((city) => (
                    <div className="col" key={city.id}>
                      <Link href={`/listings?cityId=${city.id}`} className="lb-loc">
                        {city.image ? (
                          <img
                            src={city.image}
                            alt={city.name}
                            loading="lazy"
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center text-muted"
                            style={{ width: "100%", height: "100%", minHeight: "160px" }}
                          >
                            <i className="bi bi-buildings fs-1" />
                          </div>
                        )}
                        <span className="lb-loc-body">
                          <small>Explore ads</small>
                          <strong>{city.name}</strong>
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
