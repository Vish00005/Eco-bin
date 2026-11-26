import "../styles/about.css";

const TEAM_MEMBERS = [
  {
    name: "Vishal Khimsuriya",
    role: "Lead Developer",
    specialty: "AI & Backend",
    image: "/Vishal.jpeg",
    linkedin: "https://www.linkedin.com/in/vishal-khimsuriya-06075239b/",
    github: "https://github.com/Vish00005",
  },
  {
    name: "Yashvi Bhavsar",
    role: "UI/UX Designer",
    specialty: "Frontend Architecture",
    image: "/member2.jpeg",
    linkedin: "https://www.linkedin.com/in/yashvi-bhavsar-474407337",
    github: "https://github.com/yashviii-code",
  },
  {
    name: "Vraj Patel",
    role: "Frontend Developer",
    specialty: "Frontend Architecture",
    image: "/vraj.jpeg",
    linkedin: "https://www.linkedin.com/in/vraj-patel-9bb598361",
    github: "https://github.com/vraj-ptl",
  },
];

export default function About() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="hero-content">
          <span className="tag-label">Our Mission</span>
          <h1>
            Turning E-Waste into <br />
            <span className="gradient-text">Environmental Value</span>
          </h1>
          <p>
            EcoBin is an AI-powered ecosystem designed to make e-waste recycling effortless,
            transparent, and rewarding for everyone.
          </p>
        </div>
      </header>

      <section className="split-info-centered">
        <div className="info-glass-card">
          <div className="info-text">
            <span className="mission-tag">Global Impact</span>
            <h2>The E-Waste Crisis</h2>
            <div className="divider" />
            <p>
              Millions of tons of electronic waste end up in landfills every year, leaking toxic
              metals into our soil and water. We believe technology should be the solution, not the
              problem.
            </p>

            <ul className="check-list-centered">
              <li>
                <i className="fa-solid fa-circle-check" /> Transparent tracking from bin to recycler
              </li>
              <li>
                <i className="fa-solid fa-circle-check" /> Real-time environmental impact metrics
              </li>
              <li>
                <i className="fa-solid fa-circle-check" /> Rewarding users for eco-friendly habits
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="section-header">
          <span className="tag-label">The Innovators</span>
          <h2>Meet Our Team</h2>
          <p>The minds behind EcoBin initiative.</p>
        </div>

        <div className="team-grid">
          {TEAM_MEMBERS.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="member-image">
                <img src={member.image} alt={member.name} />
                <div className="social-overlay">
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-linkedin" />
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-github" />
                  </a>
                </div>
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <span className="specialty">{member.specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
