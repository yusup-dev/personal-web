import { getExperiences } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";
import Loader from "./Loader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const ExperienceComponent = () => {
  const { data: experiences, loading } = useQuery(getExperiences, [], "experiences");

  if (loading) {
    return <Loader />;
  }

  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <section style={{ maxWidth: "900px", color: "#fff" }}>
      <h2 style={{ marginTop: "80px", fontSize: "22px", marginBottom: "40px" }}>
        Experience.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {sortedExperiences.map((exp, idx) => (
          <div key={exp.id ?? idx} style={{ display: "flex", gap: "24px" }}>
            <div style={{ position: "relative" }}>
              <div style={dotStyle} />
              {idx !== experiences.length - 1 && <div style={lineStyle} />}
            </div>
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>
                {exp.position}
              </h3>

              <p style={{ opacity: 0.8, marginBottom: "4px" }}>{exp.company}</p>

              <p style={{ opacity: 0.6, fontSize: "14px" }}>
                {formatDate(exp.startDate)}
                {exp.endDate ? ` – ${formatDate(exp.endDate)}` : " – Present"}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>

              {exp.description && (
                <p style={{ marginTop: "10px", opacity: 0.8 }}>
                  {exp.description}
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

export default ExperienceComponent;
