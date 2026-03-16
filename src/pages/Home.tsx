import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import type About from "./About";
import { getAbout } from "../api/apiClient";
import Blogs from "./Blogs";
import Loader from "../components/Loader";

const Home = () => {
  const [about, setAbout] = useState<About | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aboutData = await getAbout();
        setAbout(aboutData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  if (!about) {
    return <Loader />;
  }

  return (
    <section style={{ marginTop: "80px" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 600 }}>Muhamad Yusup</h1>

      <p
        className="muted"
        style={{ marginTop: "20px", fontSize: "18px", lineHeight: 1.6 }}
      >
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
      <Blogs limit={2} />
      <div style={{ marginTop: "15px" }}>
        <a
          href="/blogs"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            color: "#9ca3af",
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
