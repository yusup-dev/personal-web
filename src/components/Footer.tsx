import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// Namespace unik untuk site ini — ganti jika ingin reset counter
const COUNTER_NAMESPACE = "muhamadyusup-personal";
const COUNTER_KEY = "visitors";
const COUNTER_API = `https://api.counterapi.dev/v1/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

const Footer = () => {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Check API status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await axiosClient.get("/skills");
        setApiStatus("online");
      } catch {
        setApiStatus("offline");
      }
    };
    checkStatus();
  }, []);

  // Real visitor counter
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const alreadyCounted = sessionStorage.getItem("visit_counted");

        let res: Response;
        if (!alreadyCounted) {
          // New session — increment counter
          res = await fetch(`${COUNTER_API}/up`, { method: "GET" });
          sessionStorage.setItem("visit_counted", "1");
        } else {
          // Returning visitor in same session — just fetch current count
          res = await fetch(COUNTER_API);
        }

        if (res.ok) {
          const data = await res.json();
          // counterapi.dev returns { count: number }
          const count = data?.count ?? data?.value ?? null;
          if (typeof count === "number") {
            setVisitorCount(count);
          }
        }
      } catch {
        // Silently fail — keep visitorCount null (hidden)
      }
    };

    trackVisitor();
  }, []);

  const formatCount = (n: number) =>
    n.toLocaleString("en-US");

  return (
    <footer
      className="muted"
      style={{
        marginTop: "80px",
        fontSize: "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        paddingTop: "24px",
      }}
    >
      <div>
        © 2026 Muhamad Yusup
        {visitorCount !== null && (
          <span style={{ marginLeft: "16px", opacity: 0.6 }}>
            ↯ {formatCount(visitorCount)} visitors
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor:
              apiStatus === "online"
                ? "#10b981"
                : apiStatus === "offline"
                ? "#f59e0b"
                : "var(--muted)",
            boxShadow:
              apiStatus === "online"
                ? "0 0 8px #10b981"
                : apiStatus === "offline"
                ? "0 0 8px #f59e0b"
                : "none",
            transition: "all 0.3s ease",
            animation: apiStatus === "checking" ? "pulseStatus 1s infinite alternate" : "none",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            fontFamily: 'Consolas, "Fira Code", monospace',
            letterSpacing: "0.5px",
          }}
        >
          {apiStatus === "online"
            ? "API Status: Operational"
            : apiStatus === "offline"
            ? "API Status: Fallback Mode"
            : "API Status: Checking..."}
        </span>
      </div>
      <style>{`
        @keyframes pulseStatus {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
