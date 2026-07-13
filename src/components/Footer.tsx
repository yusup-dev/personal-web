import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const Footer = () => {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await axiosClient.get("/skills");
        setApiStatus("online");
      } catch (err) {
        setApiStatus("offline");
      }
    };
    checkStatus();
  }, []);

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
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div>
        © 2026 Muhamad Yusup &nbsp;&nbsp; ↯ 1,069 visitors
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
                : "#6b7280",
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

