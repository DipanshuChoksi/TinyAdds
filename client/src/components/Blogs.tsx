export default function Blogs() {
  return (
    <>
      <section className="lb-section lb-soft">
        <div className="container">
          <div className="lb-head text-center"><span className="lb-badge">insights</span><h2>Company blogs</h2></div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div className="col"><article className="lb-blog h-100">
              <a href="#" className="lb-blog-img"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/blog/thumb-1-1.jpg" alt="" loading="lazy" /><span className="lb-blog-tag">Travel</span></a>
              <div className="lb-blog-body">
                <p className="lb-meta mb-2"><span>By <em>Alson D.</em></span><span>Nov 21, 2023</span></p>
                <h3><a href="#">The website is well-organized, & making it easy to discover...</a></h3>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <a href="#" className="lb-link">Read More <i className="bi bi-arrow-right"></i></a>
                  <small className="text-muted"><i className="bi bi-chat-dots me-1"></i>12 <i className="bi bi-eye ms-2 me-1"></i>1520</small>
                </div>
              </div>
            </article></div>
            <div className="col"><article className="lb-blog h-100">
              <a href="#" className="lb-blog-img"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/blog/thumb-1-2.jpg" alt="" loading="lazy" /><span className="lb-blog-tag">Accessories</span></a>
              <div className="lb-blog-body">
                <p className="lb-meta mb-2"><span>By <em>Alson D.</em></span><span>Nov 21, 2023</span></p>
                <h3><a href="#">If you have concerns about a product or want...</a></h3>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <a href="#" className="lb-link">Read More <i className="bi bi-arrow-right"></i></a>
                  <small className="text-muted"><i className="bi bi-chat-dots me-1"></i>12 <i className="bi bi-eye ms-2 me-1"></i>1520</small>
                </div>
              </div>
            </article></div>
            <div className="col"><article className="lb-blog h-100">
              <a href="#" className="lb-blog-img"><img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/blog/thumb-1-1.jpg" alt="" loading="lazy" /><span className="lb-blog-tag">Property</span></a>
              <div className="lb-blog-body">
                <p className="lb-meta mb-2"><span>By <em>Alson D.</em></span><span>Nov 21, 2023</span></p>
                <h3><a href="#">To share your experiences, it's best to provide genuine...</a></h3>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <a href="#" className="lb-link">Read More <i className="bi bi-arrow-right"></i></a>
                  <small className="text-muted"><i className="bi bi-chat-dots me-1"></i>12 <i className="bi bi-eye ms-2 me-1"></i>1520</small>
                </div>
              </div>
            </article></div>
          </div>
        </div>
      </section>

    </>
  );
}
