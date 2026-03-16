import { useEffect, useState } from "react";
import { getPortfolio } from "../api/apiClient";
import type { Portfolio } from "../types/portfolio";
import { FiArrowUpRight } from "react-icons/fi";
import Loader from "../components/Loader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await getPortfolio();
        setPortfolios(res);
      } catch (error) {
        console.error("Failed to fetch portfolios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section style={{ maxWidth: "900px", marginTop: "80px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "24px", marginTop: "50px" }}>
        My Portfolio.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "40px",
              fontSize: "16px",
            }}
          >
            <span style={{ color: "#9ca3af", minWidth: "120px" }}>
              {formatDate(portfolio.createdAt)}
            </span>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span style={{ color: "#fff", fontWeight: 500 }}>
                {portfolio.title}
              </span>
              <div style={{ display: "flex", gap: "16px" }}>
                <a
                  href={portfolio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FiArrowUpRight className="icon" />
                  <span>github</span>
                </a>

                <a
                  href={portfolio.article}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <FiArrowUpRight className="icon" />
                  <span>article</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolios;
