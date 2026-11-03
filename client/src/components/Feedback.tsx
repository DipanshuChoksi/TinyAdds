export default function Feedback() {
  return (
    <>
      <section className="lb-section">
        <div className="container">
          <div className="lb-head text-center"><span className="lb-badge">testimonials</span><h2>Users feedback</h2></div>
          <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
            <div className="col"><figure className="lb-quote h-100">
                <span className="lb-quote-no">01</span>
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/avata/avata-2-1.png" alt="Alonso D. Dowson" width="64" height="64" className="lb-quote-av" loading="lazy" />
                <blockquote>“ TinyAdds is a hidden gem for sell, buy tech enthusiasts. They offer an array of unique and niche gadgets. ”</blockquote>
                <figcaption>Alonso D. Dowson</figcaption>
              </figure></div>
            <div className="col"><figure className="lb-quote h-100">
                <span className="lb-quote-no">02</span>
                <img src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/avata/avata-2-2.png" alt="Miranda h. Halim" width="64" height="64" className="lb-quote-av" loading="lazy" />
                <blockquote>“ Providing false information about a product can harm both consumers and manufacturers. ”</blockquote>
                <figcaption>Miranda h. Halim</figcaption>
              </figure></div>
          </div>
        </div>
      </section>
    </>
  );
}
