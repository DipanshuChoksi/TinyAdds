import Link from "next/link";

const IMG = "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/team";

const team = [
  { name: "Yasinul Huq S.", img: "team-1-1.jpg" },
  { name: "Steven Bailey", img: "team-1-2.jpg" },
  { name: "Derek Ruel", img: "team-1-3.jpg" },
  { name: "Diana C. Bailey", img: "team-1-4.jpg" },
];

export default function Team() {
  return (
    <section className="lb-section">
      <div className="container">
        <div className="lb-head text-center">
          <span className="lb-badge">team</span>
          <h2>Our team members</h2>
          <p className="mx-auto lb-sub">TinyAdds a largest classified listing website &amp; marketplace offers</p>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {team.map((m) => (
            <div className="col" key={m.name}>
              <div className="lb-member">
                <div className="lb-member-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${IMG}/${m.img}`} alt={m.name} loading="lazy" />
                </div>
                <div className="lb-member-body">
                  <em>ceo</em>
                  <h3><Link href="/about-us">{m.name}</Link></h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
