import { FiArrowUpRight } from "react-icons/fi";

const Home = () => {
  return (
    <section style={{ marginTop: "80px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 600 }}>Muhamad Yusup</h1>

      <p
        className="muted"
        style={{ marginTop: "20px", fontSize: "18px", lineHeight: 1.6 }}
      >
        Backend Engineer focused on building scalable, reliable, and secure
        systems.
      </p>

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

      <h2 style={{ fontSize: "22px", marginBottom: "24px", marginTop: "80px" }}>
        Blogs
      </h2>

      <h5 className="muted">Coming Soon...</h5>
    </section>
  );
};

export default Home;
