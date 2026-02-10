import { FiArrowUpRight } from "react-icons/fi";
import Experience from "../components/Experience";

const About = () => {
  return (
    <section style={{ maxWidth: "900px", marginTop: "80px" }}>
      {/* About */}
      <h2 style={{ fontSize: "32px", marginBottom: "24px" }}>About Me.</h2>

      <p style={{ fontSize: "16px", lineHeight: "1.8", opacity: 0.9 }}>
        Hi, I’m <strong>Muhamad Yusup</strong>, a{" "}
        <strong>Backend Engineer</strong> focused on building scalable,
        reliable, and high-performance backend systems.
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.8", opacity: 0.9 }}>
        I specialize in designing RESTful APIs, microservices, and backend
        architectures using Java Spring Boot and Golang. I enjoy solving
        problems related to system design, performance optimization, and data
        consistency.
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.8", opacity: 0.9 }}>
        Outside of work, I enjoy learning about distributed systems, backend
        architecture, and writing about technology.
      </p>

      {/* Links */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "32px",
          fontSize: "16px",
        }}
      >
        <a href="/resume.pdf" download>
          <FiArrowUpRight className="icon" style={{ marginRight: "5px" }} />
          resume
        </a>

        <a
          href="https://cal.com/yusup-dev/15min"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiArrowUpRight
            className="icon"
            style={{
              marginRight: "5px",
            }}
          />
          book a call
        </a>
      </div>

      {/* Experience */}
      <Experience />

      {/* Skills */}
      <h3 style={{ marginTop: "80px", fontSize: "24px" }}>Skills.</h3>

      <div style={skillsGrid}>
        <SkillBlock title="Languages" items="Java, Golang, TypeScript" />
        <SkillBlock title="Frameworks" items="Spring Boot, Gin, Fiber" />
        <SkillBlock title="Databases" items="PostgreSQL, MySQL, Redis" />
        <SkillBlock title="Cloud" items="AWS, Docker, GCP" />
        <SkillBlock
          title="Others"
          items="Kafka, Git, GitHub, Grafana, Prometheus"
        />
      </div>
    </section>
  );
};

const SkillBlock = ({ title, items }: { title: string; items: string }) => (
  <div>
    <h4 style={{ marginBottom: "8px" }}>{title}</h4>
    <p style={{ opacity: 0.7 }}>{items}</p>
  </div>
);

const skillsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "40px",
  marginTop: "32px",
};

export default About;
