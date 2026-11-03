const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/about";

// Same years / order as the original template — edit freely.
const milestones = [2004, 2010, 2018, 2004, 2006, 2014, 2023];

export default function CompanyJourney() {
  return (
    <section className="lb-section lb-soft">
      <div className="container">
        <div className="lb-head text-center">
          <h2>
            Company journey{" "}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lb-inline-pill" src={`${IMG}/shape-2.png`} alt="" loading="lazy" />
          </h2>
          <p className="mx-auto lb-sub">TinyAdds is a platform on which you can buy and sell almost everything!</p>
        </div>

        <ol className="lb-timeline">
          {milestones.map((year, i) => (
            <li key={i} className="lb-timeline-item">
              <span className="lb-timeline-dot" aria-hidden="true"></span>
              <div className="lb-timeline-card">
                <h3>{year}</h3>
                <p>Classified listing marketplace offers perfect.</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
