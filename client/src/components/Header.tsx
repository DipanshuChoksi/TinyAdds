"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LocationModal from "@/components/LocationModal";
import Image from "next/image";
import http from "@/lib/http";

/** Close the mobile drawer (Bootstrap's own dismiss attribute would cancel the link navigation). */
const closeDrawer = () => {
  const el = document.getElementById("mainNav");
  if (el?.classList.contains("show")) el.querySelector<HTMLElement>(".btn-close")?.click();
};

export default function Header() {
  const pathname = usePathname();
  // const [locOpen, setLocOpen] = useState(false);
  const [city, setCity] = useState("");
  const [accountName, setAccountName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    try { setCity(localStorage.getItem("tinyadds:city") ?? ""); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    let active = true;
    http.get<{ firstName: string; lastName: string; profileImage?: string }>("/auth/me").then(({ data }) => {
      if (active) {
        const rawFirst = (data.firstName || "").trim().split(/\s+/)[0] || "";
        const formattedName = rawFirst.slice(0, 10);
        setAccountName(formattedName);
        setProfileImage(data.profileImage || "");
        setImgError(false);
      }
    }).catch(() => {
      if (active) {
        setAccountName("");
        setProfileImage("");
        setImgError(false);
      }
    });
    return () => { active = false; };
  }, [pathname]);

  // const selectCity = (value: string) => {
  //   setCity(value);
  //   try { localStorage.setItem("tinyadds:city", value); } catch { /* ignore */ }
  // };

  const onAbout = pathname === "/about-us";
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const onContact = pathname === "/contact";
  const onPackages = pathname === "/subscription-packages";


  // Do not render public header on admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }


  return (
    <>
      <header className="lb-header sticky-top">
        <nav className="navbar navbar-expand-xl">
          <div className="container">
            <Link className="navbar-brand lb-wordmark" href="/">
              <Image
                src="/logo.png"
                alt="TinyAdds"
                width={180}
                height={60}
                priority
                style={{
                  width: "180px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#mainNav" aria-controls="mainNav" aria-label="Toggle navigation"><i className="bi bi-list fs-1"></i></button>
            <div className="offcanvas offcanvas-end lb-drawer" tabIndex={-1} id="mainNav" aria-labelledby="mainNavLabel">
              <div className="offcanvas-header">
                <Link className="navbar-brand lb-wordmark m-0" href="/" id="mainNavLabel" onClick={closeDrawer}>Tiny<span>Adds</span></Link>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#mainNav" aria-label="Close menu"></button>
              </div>
              <div className="offcanvas-body flex-grow-1">
                <ul className="navbar-nav mx-xl-auto align-items-xl-center gap-lg-3 gap-0">
                  <li className="nav-item"><Link className={`nav-link${pathname === "/" ? " active" : ""}`} href="/" onClick={closeDrawer}>Home</Link></li>
                  <li className="nav-item"><Link className={`nav-link${pathname === "/listings" ? " active" : ""}`} href="/listings" onClick={closeDrawer}>Listings</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onAbout ? " active" : ""}`} href="/about-us" onClick={closeDrawer}>About Us</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onBlog ? " active" : ""}`} href="/blog" onClick={closeDrawer}>Blog</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onPackages ? " active" : ""}`} href="/subscription-packages" onClick={closeDrawer}>Packages</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onContact ? " active" : ""}`} href="/contact" onClick={closeDrawer}>Contact</Link></li>
                </ul>
                <div className="d-flex flex-column flex-xl-row align-items-stretch align-items-xl-center gap-3 mt-4 mt-xl-0 pt-3 pt-xl-0  md:border-top border-xl-0">
                  <div className="d-flex align-items-center justify-content-between justify-content-xl-start gap-3">
                    {/* <button type="button" className="lb-city-btn" onClick={() => setLocOpen(true)} aria-label="Select location">
                      <i className="bi bi-geo-alt-fill"></i>{city && <span>{city}</span>}
                    </button> */}
                    <Link
                      href={accountName ? "/client-admin" : "/login"}
                      className="lb-signin d-inline-flex align-items-center gap-2"
                      onClick={closeDrawer}
                    >
                      {profileImage && !imgError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileImage}
                          alt={accountName || "User"}
                          className="rounded-circle object-fit-cover"
                          style={{ width: "26px", height: "26px" }}
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <i className="bi bi-person-circle fs-5"></i>
                      )}
                      <span className="text-truncate" style={{ maxWidth: "120px" }}>
                        {accountName || "Sign In"}
                      </span>
                    </Link>
                  </div>
                  <Link
                    href="/client-admin"
                    className="btn lb-btn-primary d-inline-flex align-items-center justify-content-center text-nowrap"
                    onClick={closeDrawer}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Post Your Ad
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* <LocationModal open={locOpen} current={city} onClose={() => setLocOpen(false)} onSelect={selectCity} /> */}
    </>
  );
}
