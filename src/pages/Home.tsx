import { FiArrowUpRight } from "react-icons/fi";
import { getAbout } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";
import Blogs from "./Blogs";
import Loader from "../components/Loader";
import type { About } from "../types/about";

const defaultAbout: About = {
  title: "",
  shortDescription: "",
  description: "",
  contactLink: "",
  resumeUrl: "",
};

const Home = () => {
  const { data: about, loading } = useQuery(getAbout, defaultAbout, "about");

  if (loading) {
    return <Loader />;
  }

  return (
    <section style={{ marginTop: "64px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 600 }}>{about.title}</h1>

      <p
        className="muted"
        style={{ marginTop: "20px", fontSize: "18px", lineHeight: 1.6 }}
      >
        {about.shortDescription}
      </p>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "32px",
          fontSize: "16px",
        }}
      >
        <a href={`${import.meta.env.VITE_API_URL}/about/1/download`} download="resume.pdf" target="_blank" rel="noopener noreferrer">
          <FiArrowUpRight className="icon" style={{ marginRight: "5px" }} />
          resume
        </a>

        <a href={about.contactLink} target="_blank" rel="noopener noreferrer">
          <FiArrowUpRight
            className="icon"
            style={{
              marginRight: "5px",
            }}
          />
          contact me
        </a>
      </div>
      <Blogs limit={5} />
      <div style={{ marginTop: "24px" }}>
        <a
          href="/blogs"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            color: "var(--muted)",
          }}
        >
          See All Blogs
          <FiArrowUpRight />
        </a>
      </div>
    </section>
  );
};

export default Home;
