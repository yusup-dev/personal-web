import { useState, useEffect } from "react";
import { subscribeToFallbackStatus } from "../hooks/useQuery";
import { FiWifiOff, FiRefreshCw } from "react-icons/fi";

const NotificationBanner = () => {
  const [isFallback, setIsFallback] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Subscribe to query status updates
    const unsubscribe = subscribeToFallbackStatus((status) => {
      setIsFallback(status);
    });
    return unsubscribe;
  }, []);

  if (!isFallback) return null;

  const handleRetry = () => {
    setRetrying(true);
    // Reload page to retry all API calls
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div style={bannerContainerStyle}>
      <div style={bannerContentStyle}>
        <div style={headerStyle}>
          <FiWifiOff style={{ fontSize: "18px", color: "#f59e0b" }} />
          <span style={{ fontWeight: 600, color: "#f59e0b" }}>Offline Fallback Mode</span>
        </div>

        <p style={{ margin: 0, opacity: 0.85, fontSize: "13px" }}>
          Unable to establish a secure connection to the Vercel API. We have loaded local fallback database data to ensure the website remains accessible.
        </p>

        <button
          onClick={handleRetry}
          style={buttonStyle(retrying)}
          disabled={retrying}
        >
          <FiRefreshCw
            style={{
              marginRight: "6px",
              animation: retrying ? "spin 1s linear infinite" : "none",
            }}
          />
          {retrying ? "Connecting..." : "Retry Server Connection"}
        </button>
      </div>
    </div>
  );
};

const bannerContainerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  maxWidth: "380px",
  backgroundColor: "rgba(18, 18, 18, 0.85)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(245, 158, 11, 0.25)",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
  zIndex: 9999,
  fontFamily: "Inter, sans-serif",
  animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
};

const bannerContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  color: "#eaeaea",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
};

const buttonStyle = (retrying: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: retrying ? "rgba(255, 255, 255, 0.05)" : "rgba(245, 158, 11, 0.12)",
  color: retrying ? "#9ca3af" : "#f59e0b",
  border: `1px solid ${retrying ? "rgba(255, 255, 255, 0.1)" : "rgba(245, 158, 11, 0.25)"}`,
  borderRadius: "8px",
  padding: "8px 14px",
  fontSize: "12px",
  fontWeight: 500,
  cursor: retrying ? "not-allowed" : "pointer",
  transition: "all 0.2s ease",
  alignSelf: "flex-end",
  marginTop: "4px",
});

export default NotificationBanner;
