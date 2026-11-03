"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Close the mobile drawer (Bootstrap's own dismiss attribute would cancel the link navigation). */
const closeDrawer = () => {
  const el = document.getElementById("mainNav");
  if (el?.classList.contains("show")) el.querySelector<HTMLElement>(".btn-close")?.click();
};

export default function Header() {
  const pathname = usePathname();
  const onAbout = pathname === "/about-us";
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const onContact = pathname === "/contact";

  // Do not render public header on admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="lb-header sticky-top">
        <nav className="navbar navbar-expand-xl">
          <div className="container">
            <Link className="navbar-brand lb-wordmark" href="/">Tiny<span>Adds</span></Link>
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#mainNav" aria-controls="mainNav" aria-label="Toggle navigation"><i className="bi bi-list fs-1"></i></button>
            <div className="offcanvas offcanvas-end lb-drawer" tabIndex={-1} id="mainNav" aria-labelledby="mainNavLabel">
              <div className="offcanvas-header">
                <Link className="navbar-brand lb-wordmark m-0" href="/" id="mainNavLabel" onClick={closeDrawer}>Tiny<span>Adds</span></Link>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#mainNav" aria-label="Close menu"></button>
              </div>
              <div className="offcanvas-body flex-grow-1">
                <ul className="navbar-nav mx-xl-auto align-items-xl-center gap-lg-3 gap-0">
                  <li className="nav-item"><Link className={`nav-link${pathname === "/" ? " active" : ""}`} href="/" onClick={closeDrawer}>Home</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onAbout ? " active" : ""}`} href="/about-us" onClick={closeDrawer}>About Us</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onBlog ? " active" : ""}`} href="/blog" onClick={closeDrawer}>Blog</Link></li>
                  <li className="nav-item"><Link className={`nav-link${onContact ? " active" : ""}`} href="/contact" onClick={closeDrawer}>Contact</Link></li>
                </ul>
                <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 gap-sm-3 mt-3 mt-xl-0">
                  <Link href="/login" className="lb-signin" onClick={closeDrawer}><i className="bi bi-person-circle me-2"></i>Sign In</Link>
                  <a href="#" className="btn lb-btn-primary"><i className="bi bi-plus-circle me-2"></i>Post Your Add</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

    </>
  );
}
