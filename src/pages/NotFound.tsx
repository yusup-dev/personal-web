import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section style={{ marginTop: "80px", color: "#fff", maxWidth: "600px" }}>
      <h2 style={{ fontSize: "36px", fontWeight: 600, marginBottom: "16px" }}>404.</h2>
      <p style={{ color: "#9ca3af", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          padding: "8px 20px",
          fontSize: "14px",
          textDecoration: "none",
          transition: "border-color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)")}
      >
        Go Home
      </Link>
    </section>
  );
};

export default NotFound;
