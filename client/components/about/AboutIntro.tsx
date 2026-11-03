import Link from "next/link";

const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/about";

const features = [
  { title: "Quality Team", icon: "bi-people" },
  { title: "Top-Notch Item", icon: "bi-award" },
  { title: "Good Support", icon: "bi-headset" },
  { title: "Easy To Use", icon: "bi-hand-thumbs-up" },
];

export default function AboutIntro() {
  return (
    <section className="lb-section">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <div className="lb-about-media">
              <span className="lb-blob lb-blob-1" aria-hidden="true"></span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/details-1.jpg`} alt="TinyAdds team" loading="lazy" />
            </div>
          </div>

          <div className="col-lg-7">
            <h2 className="lb-h2-left lb-about-title">
              About <em>TinyAdds</em>, The Largest buy, sell, exchange{" "}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb-inline-pill" src={`${IMG}/shape-2.png`} alt="" loading="lazy" /> Marketplace in{" "}
              <strong>United States.</strong>
            </h2>

            <div className="row g-3 mt-3">
              {features.map((f) => (
                <div className="col-sm-6" key={f.title}>
                  <div className="lb-feature">
                    <span className="lb-feature-ico"><i className={`bi ${f.icon}`}></i></span>
                    <h3>{f.title}</h3>
                    <p>Classified listing marketplace offers perfect.</p>
                    <Link href="/contact" className="lb-link">
                      Get In Touch <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
