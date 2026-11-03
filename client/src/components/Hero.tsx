import CategoryMarquee from "./CategoryMarquee";
import CountUp from "./CountUp";

export default function Hero() {
  return (
    <>
      <section className="lb-hero">
        <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/shape-1-3.png" alt="" className="lb-shape lb-hero-shape-bg d-none d-lg-block" />
        <div className="container position-relative">
          <CategoryMarquee />

          <div className="row align-items-center g-5 pt-4 pb-5">
            <div className="col-lg-6">
              <span className="lb-badge">TinyAdds</span>
              <h1 className="lb-hero-title">Get daily thing in same platform</h1>
              <ul className="nav lb-hero-tabs" role="tablist">
      <li className="nav-item" role="presentation"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#hero-buy" type="button" role="tab" aria-selected="true">Buy</button></li>
      <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#hero-sell" type="button" role="tab" aria-selected="false">Sell</button></li>
      <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#hero-rent" type="button" role="tab" aria-selected="false">Rent</button></li>
              </ul>
              <p className="lb-hero-count"><em>50k+</em> thing is waiting for you</p>
              <div className="tab-content">
      <div className="tab-pane fade show active" id="hero-buy" role="tabpanel"><form className="lb-search" action="#">
                    <div className="lb-search-field"><label htmlFor="find-buy">Find</label><input id="find-buy" type="text" placeholder="What are you looking for?" /></div>
                    <div className="lb-search-field"><label htmlFor="where-buy">Where</label><input id="where-buy" type="text" placeholder="City or area" /></div>
                    <button className="btn lb-btn-primary" type="submit"><i className="bi bi-search me-2"></i>Search Now</button>
                  </form></div>
      <div className="tab-pane fade" id="hero-sell" role="tabpanel"><form className="lb-search" action="#">
                    <div className="lb-search-field"><label htmlFor="find-sell">Find</label><input id="find-sell" type="text" placeholder="What are you looking for?" /></div>
                    <div className="lb-search-field"><label htmlFor="where-sell">Where</label><input id="where-sell" type="text" placeholder="City or area" /></div>
                    <button className="btn lb-btn-primary" type="submit"><i className="bi bi-search me-2"></i>Search Now</button>
                  </form></div>
      <div className="tab-pane fade" id="hero-rent" role="tabpanel"><form className="lb-search" action="#">
                    <div className="lb-search-field"><label htmlFor="find-rent">Find</label><input id="find-rent" type="text" placeholder="What are you looking for?" /></div>
                    <div className="lb-search-field"><label htmlFor="where-rent">Where</label><input id="where-rent" type="text" placeholder="City or area" /></div>
                    <button className="btn lb-btn-primary" type="submit"><i className="bi bi-search me-2"></i>Search Now</button>
                  </form></div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="lb-collage">
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/shape-1-1.png" alt="" className="lb-shape lb-collage-shape-1" />
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/shape-1-2.png" alt="" className="lb-shape lb-collage-shape-2" />
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/hero-1-1.jpg" alt="" className="lb-collage-a" />
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/hero-1-3.jpg" alt="" className="lb-collage-b" />
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/hero-1-2.jpg" alt="" className="lb-collage-c" />
                <div className="lb-counter"><h6><CountUp target={1500} />+</h6><p>Daily Ads Listing</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
