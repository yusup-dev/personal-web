import { FiArrowUpRight } from "react-icons/fi";
import Experience from "../components/Experience";
import { getAbout, getSkills } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";
import EducationComponent from "../components/Education";
import Loader from "../components/Loader";
import type { About } from "../types/about";
import type { Skill } from "../types/skill";

const defaultAbout: About = {
  title: "",
  shortDescription: "",
  description: "",
  contactLink: "",
  resumeUrl: "",
};

const defaultSkills: Skill[] = [];

const AboutPage = () => {
  const { data: about, loading: aboutLoading } = useQuery(getAbout, defaultAbout, "about");
  const { data: skills, loading: skillsLoading } = useQuery(getSkills, defaultSkills, "skills");

  if (aboutLoading || skillsLoading) {
    return <Loader/>;
  }

  const groupedSkills = skills.reduce((acc: Record<string, string[]>, skill) => {
  if (!acc[skill.category]) {
    acc[skill.category] = [];
  }

  acc[skill.category].push(skill.name);
  return acc;
}, {});

  return (
    <section style={{ maxWidth: "900px", marginTop: "80px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>About Me.</h2>

      <p style={{ fontSize: "16px", lineHeight: "1.8", opacity: 0.9 }}>
        {about.description}
      </p>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "32px",
          fontSize: "16px",
        }}
      >
        <a href={about.resumeUrl}>
          <FiArrowUpRight className="icon" style={{ marginRight: "5px" }} />
          resume
        </a>

        <a href={about.contactLink} target="_blank" rel="noopener noreferrer">
          <FiArrowUpRight style={{ marginRight: "5px" }} />
          contact me
        </a>
      </div>

      <Experience />

      <EducationComponent/>

      <h2 style={{ marginTop: "80px", fontSize: "22px" }}>Skills.</h2>

      <div style={skillsGrid}>
        {Object.entries(groupedSkills).map(([category, items]) => (
          <SkillBlock
            key={category}
            title={category}
            items={(items as string[]).join(", ")}
          />
        ))}
      </div>
    </section>
  );
};

const SkillBlock = ({ title, items }: { title: string; items: string }) => (
  <div>
    <h4 style={{ marginBottom: "12px", fontSize: "15px", fontWeight: 600 }}>{title}</h4>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {items.split(",").map((item) => (
        <span
          key={item}
          style={{
            fontSize: "12px",
            fontFamily: 'Consolas, "Fira Code", "JetBrains Mono", monospace',
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "4px 10px",
            borderRadius: "6px",
            color: "#eaeaea",
            opacity: 0.85,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
          }}
        >
          {item.trim()}
        </span>
      ))}
    </div>
  </div>
);

const skillsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "32px",
  marginTop: "24px",
};


export default AboutPage;