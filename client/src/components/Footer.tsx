"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="lb-footer">
      <div className="container">
        <div className="row g-lg-5 g-0 lb-footer-top">

          {/* Logo & Support */}
          <div className="col-lg-4">
            <Link href="/" className="lb-footer-logo">
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

            <p className="mb-1 small opacity-75 mt-4">
              support email
            </p>

            <h3 className="lb-footer-mail">
              info@tinyadds.com
            </h3>
          </div>

          {/* Essential Links */}
          <div className="col-md-6 col-lg-4">
            <h3 className="lb-footer-h">Essential</h3>

            <ul className="lb-footer-links">
              <li><Link href="/contact">Company &amp; Contact Info</Link></li>
              <li><Link href="/blog">Blog &amp; Articles</Link></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Live Chat</a></li>
              <li><a href="#">FAQ Page</a></li>
              <li><a href="#">How to Stay Safe</a></li>
              <li><a href="#">Terms &amp; Conditions</a></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="col-md-6 col-lg-4">
            <p className="lb-footer-about">
              <em>TinyAdds</em> a Largest Classified Listing
              Marketplace offers perfect solutions to buy,
              sell and rent products and services online.
            </p>

            <Link
              href="/contact"
              className="btn btn-light rounded-pill px-4"
            >
              Get It Now
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="lb-footer-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">

          <p className="mb-0 small">
            Copyright &copy; 2026 TinyAdds
          </p>

          <div className="lb-social">
            <a href="#" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
