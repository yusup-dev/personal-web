import { FiArrowUpRight } from "react-icons/fi";
import Experience from "../components/Experience";
import type { About } from "../types/about";
import { useEffect, useState } from "react";
import { getAbout, getSkills } from "../api/apiClient";
import type { Skill } from "../types/skill";
import EducationComponent from "../components/Education";
import Loader from "../components/Loader";

const AboutPage = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutData = await getAbout();
        setAbout(aboutData);

        const skillsData = await getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  if (!about) {
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
        <a href={`${import.meta.env.VITE_API_URL}/about/1/download`}>
          <FiArrowUpRight style={{ marginRight: "5px" }} />
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

export default AboutPage;