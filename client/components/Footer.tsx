import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="lb-footer">
        <div className="container">
          <div className="row g-5 lb-footer-top">
            <div className="col-lg-4">
              <span className="lb-footer-label">TinyAdds</span>
              <p className="mb-1 small opacity-75">support email</p>
              <h3 className="lb-footer-mail">info@tinyadds.com</h3>
              <form action="#" className="mt-4">
                <div className="mb-3"><label htmlFor="f-name" className="visually-hidden">full name</label><input id="f-name" className="form-control" placeholder="full name" /></div>
                <div className="mb-3"><label htmlFor="f-mail" className="visually-hidden">email address</label><input id="f-mail" type="email" className="form-control" placeholder="email address" /></div>
                <div className="mb-3"><label htmlFor="f-msg" className="visually-hidden">message</label><textarea id="f-msg" className="form-control" rows={3} placeholder="message" /></div>
                <button type="submit" className="btn lb-btn-primary px-4">Submit</button>
              </form>
            </div>
            <div className="col-md-6 col-lg-4">
              <h3 className="lb-footer-h">Essential</h3>
              <ul className="lb-footer-links">
      <li><Link href="/contact">Company &amp; Contact Info</Link></li>
      <li><a href="#">Blog &amp; Articles</a></li>
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
            <div className="col-md-6 col-lg-4">
              <p className="lb-footer-about"><em>TinyAdds</em> a Largest Classified Listing Marketplace offers perfect WordPress Ads classified Themes to build your own classified websites.</p>
              <Link href="/contact" className="btn btn-light rounded-pill px-4">Get It Now</Link>
            </div>
          </div>

          <div className="lb-footer-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
            <a href="#"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/logo/logo-white-2.png" alt="TinyAdds" height="34" /></a>
            <p className="mb-0 small">Copyright &amp; Design by <a href="#">@ThemePure</a> - 2024</p>
            <div className="lb-social"><a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a><a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a><a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a><a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a></div>
            <div className="dropdown">
              <button className="btn btn-outline-light btn-sm rounded-pill dropdown-toggle px-3" data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-globe2 me-2"></i>English</button>
              <ul className="dropdown-menu dropdown-menu-end"><li><a className="dropdown-item" href="#">Arabic</a></li><li><a className="dropdown-item" href="#">Spanish</a></li><li><a className="dropdown-item" href="#">Mandarin</a></li></ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
