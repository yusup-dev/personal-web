import { getEducations } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";
import Loader from "./Loader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const isPresent = (date?: string | null) => {
  if (!date) return true;
  const lower = date.trim().toLowerCase();
  return lower === "null" || lower === "" || date.startsWith("0000-00-00") || date.startsWith("0001-01-01");
};

const EducationComponent = () => {
  const { data: educations, loading } = useQuery(getEducations, [], "educations");

  if (loading) {
    return <Loader/>;
  }

  const sortedEducations = [...educations].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <section style={{ maxWidth: "900px", color: "#fff" }}>
      <h2 style={{ marginTop: "80px", fontSize: "22px", marginBottom: "40px" }}>
        Education.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {sortedEducations.map((edu, idx) => (
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
                {isPresent(edu.endDate) ? " – Present" : ` – ${formatDate(edu.endDate!)}`}
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