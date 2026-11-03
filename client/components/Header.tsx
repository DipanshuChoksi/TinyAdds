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
  const onPages = pathname === "/about-us";
  const onContact = pathname === "/contact";

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
              <ul className="navbar-nav mx-xl-auto align-items-xl-center">
                <li className="nav-item"><Link className={`nav-link${pathname === "/" ? " active" : ""}`} href="/" onClick={closeDrawer}>Home</Link></li>
                <li className="nav-item dropdown"><a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Listings</a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Listings Grid</a></li><li><a className="dropdown-item" href="#">Listings List</a></li>
                    <li><a className="dropdown-item" href="#">Listings Ads</a></li><li><a className="dropdown-item" href="#">Listings Details 01</a></li><li><a className="dropdown-item" href="#">Listings Details 02</a></li>
                  </ul></li>
                <li className="nav-item dropdown"><a className={`nav-link dropdown-toggle${onPages ? " active" : ""}`} href="#" data-bs-toggle="dropdown" aria-expanded="false">Pages</a>
                  <ul className="dropdown-menu">
                    <li><Link className={`dropdown-item${onPages ? " active" : ""}`} href="/about-us" onClick={closeDrawer}>About Us</Link></li><li><a className="dropdown-item" href="#">Faq</a></li><li><a className="dropdown-item" href="#">Login</a></li>
                    <li><a className="dropdown-item" href="#">Register</a></li><li><a className="dropdown-item" href="#">Chat</a></li><li><a className="dropdown-item" href="#">Profile</a></li>
                    <li><a className="dropdown-item" href="#">Store</a></li><li><a className="dropdown-item" href="#">Store List</a></li><li><a className="dropdown-item" href="#">Blog Sidebar</a></li>
                    <li><a className="dropdown-item" href="#">Blog Details</a></li><li><a className="dropdown-item" href="#">404</a></li><li><a className="dropdown-item" href="#">Coming Soon</a></li>
                  </ul></li>
                <li className="nav-item"><a className="nav-link" href="#" data-bs-dismiss="offcanvas" data-bs-target="#mainNav">Plans</a></li>
                <li className="nav-item dropdown"><a className={`nav-link dropdown-toggle${onContact ? " active" : ""}`} href="#" data-bs-toggle="dropdown" aria-expanded="false">Contact</a>
                  <ul className="dropdown-menu"><li><Link className={`dropdown-item${onContact ? " active" : ""}`} href="/contact" onClick={closeDrawer}>Contact</Link></li><li><a className="dropdown-item" href="#">Contact 02</a></li></ul></li>
              </ul>
              <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 gap-sm-3 mt-3 mt-xl-0">
                <a href="#" className="lb-signin"><i className="bi bi-person-circle me-2"></i>Sign In</a>
                <a href="#" className="btn lb-btn-primary"><i className="bi bi-plus-circle me-2"></i>Post Your Ad</a>
              </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

    </>
  );
}
