import { useEffect, useState } from "react";
import {getEducations } from "../api/apiClient";
import type { Education } from "../types/education";
import Loader from "./Loader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const EducationComponent = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await getEducations();
        setEducations(data);
      } catch (error) {
        console.error("Failed to fetch educations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <section style={{ maxWidth: "900px", color: "#fff" }}>
      <h2 style={{ marginTop: "80px", fontSize: "22px", marginBottom: "40px" }}>
        Education.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {educations.map((edu, idx) => (
          <div key={edu.id ?? idx} style={{ display: "flex", gap: "24px" }}>
            <div style={{ position: "relative" }}>
              <div style={dotStyle} />
              {idx !== educations.length - 1 && (
                <div style={lineStyle} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>
                {edu.school}
              </h3>

              <p style={{ opacity: 0.8, marginBottom: "4px" }}>
                {edu.degree}
              </p>

              <p style={{ opacity: 0.6, fontSize: "14px" }}>
                {formatDate(edu.startDate)}
                {edu.endDate ? ` – ${formatDate(edu.endDate)}` : " – Present"}
                {edu.location ? ` · ${edu.location}` : ""}
              </p>

              {edu.gpa && (
                <p style={{ marginTop: "10px", opacity: 0.8, fontSize:"14px" }}>
                  GPA : {edu.gpa}
                </p>
              )}
              {edu.description && (
                <p style={{ marginTop: "10px", opacity: 0.8 }}>
                  {edu.description}
                </p>
              )}
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

export default EducationComponent;