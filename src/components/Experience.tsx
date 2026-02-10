type ExperienceItem = {
  title: string;
  company: string;
  date: string;
  location?: string;
  // description: string[];
};

const experiences: ExperienceItem[] = [
  {
    title: "Parallel Career Preparation & Technical Upskilling",
    company: "Intensive Self-Directed Development",
    date: "Feb 2026 – Present · 1 mo",
    // description: [
    //   "Conducting intensive technical upskilling while completing Bachelor's thesis on system integration",
    //   "Researching and implementing system integration patterns, API design, and data synchronization techniques",
    //   "Building Go-based microservices projects focusing on scalable integrations",
    //   "Developing portfolio applications that demonstrate real-world integration scenarios",
    //   "Technologies: Go, REST/GraphQL APIs, PostgreSQL, message queues, Docker",
    //   "Target role: Backend / Integration Engineer (Global Tech)",
    // ],
  },
  {
    title: "Back End Developer",
    company: "Cranium Indonesia · Contract",
    date: "Mar 2025 – Jan 2026 · 11 mos",
    location: "Jakarta, Indonesia · Hybrid",
    // description: [
    //   "Built scalable, reliable, and secure backend services",
    //   "Designed RESTful APIs and database schemas",
    //   "Collaborated with frontend and product teams",
    // ],
  },
  {
    title: "Back End Developer",
    company: "Tohjiwa Teknologi · Full-time",
    date: "Oct 2024 – Feb 2025 · 5 mos",
    location: "Denpasar, Bali, Indonesia · Remote",
    // description: [
    //   "Developed backend systems with focus on scalability and reliability",
    //   "Handled authentication, authorization, and API integration",
    // ],
  },
  {
    title: "Back End Developer Intern",
    company: "Tohjiwa Teknologi · Internship",
    date: "Feb 2024 – Sep 2024 · 8 mos",
    location: "Remote",
    // description: [
    //   "Assisted in backend API development",
    //   "Worked with databases and backend logic under senior supervision",
    // ],
  },
];

const Experience = () => {
  return (
    <section style={{ maxWidth: "900px", color: "#fff" }}>
      <h3 style={{ marginTop: "80px", fontSize: "24px", marginBottom: "40px" }}>Experience.</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {experiences.map((exp, idx) => (
          <div key={idx} style={{ display: "flex", gap: "24px" }}>
            {/* Timeline dot */}
            <div style={{ position: "relative" }}>
              <div style={dotStyle} />
              {idx !== experiences.length - 1 && (
                <div style={lineStyle} />
              )}
            </div>

            {/* Content */}
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>
                {exp.title}
              </h3>

              <p style={{ opacity: 0.8, marginBottom: "4px" }}>
                {exp.company}
              </p>

              <p style={{ opacity: 0.6, fontSize: "14px" }}>
                {exp.date}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>

              {/* <ul style={descStyle}>
                {exp.description.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  marginTop: "6px",
};

const lineStyle = {
  width: "2px",
  height: "100%",
  backgroundColor: "rgba(255,255,255,0.2)",
  margin: "4px auto 0",
};

// const descStyle = {
//   marginTop: "12px",
//   paddingLeft: "18px",
//   opacity: 0.85,
//   lineHeight: "1.7",
// };

export default Experience;
