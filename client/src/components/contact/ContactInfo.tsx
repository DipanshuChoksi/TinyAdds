"use client";

const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/contact";

export default function ContactInfo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add your contact API integration here.
  };

  return (
    <section className="lb-section">
      <div className="container">
        <div className="row align-items-center g-lg-5 g-4">

          {/* Contact Images */}
          <div className="col-lg-6 order-lg-2">
            <div className="lb-contact-media">
              <span
                className="lb-blob lb-blob-1"
                aria-hidden="true"
              ></span>

              <span
                className="lb-blob lb-blob-2"
                aria-hidden="true"
              ></span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lb-contact-img lb-contact-img-1"
                src={`${IMG}/thumb-1.png`}
                alt="Contact TinyAdds"
                loading="lazy"
              />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lb-contact-img lb-contact-img-2"
                src={`${IMG}/thumb-2.png`}
                alt="Get in touch with TinyAdds"
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6 order-lg-1">
            <span className="lb-badge">Contact Us</span>

            <h2 className="lb-h2-left">
              We're happy to discuss your project &amp; answer your questions.
            </h2>

            <form onSubmit={handleSubmit} className="lb-contact-form">

              <div className="row g-3">

                <div className="col-12">
                  <label htmlFor="f-name" className="lb-form-label">
                    Full Name <span>*</span>
                  </label>
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    className="form-control lb-form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="f-mail" className="lb-form-label">
                    Email Address <span>*</span>
                  </label>
                  <input
                    id="f-mail"
                    name="email"
                    type="email"
                    className="form-control lb-form-control"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="f-msg" className="lb-form-label">
                    Your Message <span>*</span>
                  </label>
                  <textarea
                    id="f-msg"
                    name="message"
                    className="form-control lb-form-control lb-form-textarea"
                    rows={5}
                    placeholder="Write your message here..."
                    required
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="lb-contact-submit">
                    Send Message
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>

              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
