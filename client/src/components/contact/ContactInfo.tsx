const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/contact";

export default function ContactInfo() {
  return (
    <section className="lb-section">
      <div className="container">
        <div className="row align-items-center g-lg-5 g-0">
          <div className="col-lg-6 order-lg-2">
            <div className="lb-contact-media">
              <span className="lb-blob lb-blob-1" aria-hidden="true"></span>
              <span className="lb-blob lb-blob-2" aria-hidden="true"></span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb-contact-img lb-contact-img-1" src={`${IMG}/thumb-1.png`} alt="" loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb-contact-img lb-contact-img-2" src={`${IMG}/thumb-2.png`} alt="" loading="lazy" />
            </div>
          </div>

          <div className="col-lg-6 order-lg-1">
            <span className="lb-badge">contact</span>
            <h2 className="lb-h2-left">We’re happy to discuss your project &amp; answer</h2>
            <ul className="lb-contact-list">
              <li>
                <span className="lb-contact-ico"><i className="bi bi-geo-alt"></i></span>
                <a href="#">984 West College St. Sun City, United States of America</a>
              </li>
              <li>
                <span className="lb-contact-ico"><i className="bi bi-envelope"></i></span>
                <div>
                  <a href="mailto:info@tinyadds.com">info@tinyadds.com</a>
                  <a href="tel:+77788855500" className="d-block">+777 888 555 00</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
