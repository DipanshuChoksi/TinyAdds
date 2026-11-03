export default function SearchByLocation() {
  return (
    <>
      <section className="lb-section">
        <div className="container">
          <div className="lb-head d-flex flex-wrap align-items-end justify-content-between gap-3">
            <div><span className="lb-badge">Search by location</span><h2>Search by location</h2></div>
            <ul className="nav lb-pills" role="tablist">
      <li className="nav-item" role="presentation"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#loc-asia" type="button" role="tab">asia</button></li>
      <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#loc-usa" type="button" role="tab">usa</button></li>
      <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#loc-europe" type="button" role="tab">europe</button></li>
            </ul>
          </div>
          <div className="tab-content">
      <div className="tab-pane fade show active" id="loc-asia" role="tabpanel"><div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 g-lg-4">
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-1.jpg" alt="Tokyo" loading="lazy" /><span className="lb-loc-body"><small>230+ ads</small><strong>Tokyo</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-2.jpg" alt="Bangkok" loading="lazy" /><span className="lb-loc-body"><small>190+ listing</small><strong>Bangkok</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-3.jpg" alt="Dhaka" loading="lazy" /><span className="lb-loc-body"><small>500+ listing</small><strong>Dhaka</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-4.jpg" alt="Mumbai" loading="lazy" /><span className="lb-loc-body"><small>299+ listing</small><strong>Mumbai</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-5.jpg" alt="Hanoi" loading="lazy" /><span className="lb-loc-body"><small>190+ listing</small><strong>Hanoi</strong></span></a></div>
              </div></div>
      <div className="tab-pane fade" id="loc-usa" role="tabpanel"><div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 g-lg-4">
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-2.jpg" alt="Astoi" loading="lazy" /><span className="lb-loc-body"><small>366+ listing</small><strong>Astoi</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-3.jpg" alt="Dhaka" loading="lazy" /><span className="lb-loc-body"><small>500+ listing</small><strong>Dhaka</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-4.jpg" alt="Mumbai" loading="lazy" /><span className="lb-loc-body"><small>299+ listing</small><strong>Mumbai</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-1.jpg" alt="Tokyo" loading="lazy" /><span className="lb-loc-body"><small>230+ ads</small><strong>Tokyo</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-2.jpg" alt="Bangkok" loading="lazy" /><span className="lb-loc-body"><small>190+ listing</small><strong>Bangkok</strong></span></a></div>
              </div></div>
      <div className="tab-pane fade" id="loc-europe" role="tabpanel"><div className="row row-cols-2 row-cols-md-3 row-cols-xl-5 g-3 g-lg-4">
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-5.jpg" alt="Hanoi" loading="lazy" /><span className="lb-loc-body"><small>190+ listing</small><strong>Hanoi</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-2.jpg" alt="Astoi" loading="lazy" /><span className="lb-loc-body"><small>366+ listing</small><strong>Astoi</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-3.jpg" alt="Dhaka" loading="lazy" /><span className="lb-loc-body"><small>500+ listing</small><strong>Dhaka</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-4.jpg" alt="Mumbai" loading="lazy" /><span className="lb-loc-body"><small>299+ listing</small><strong>Mumbai</strong></span></a></div>
                <div className="col"><a href="#" className="lb-loc"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/location/thumb-1-1.jpg" alt="Tokyo" loading="lazy" /><span className="lb-loc-body"><small>230+ ads</small><strong>Tokyo</strong></span></a></div>
              </div></div>
          </div>
        </div>
      </section>
    </>
  );
}
