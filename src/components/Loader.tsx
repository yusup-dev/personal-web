import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "20vh",
        gap: "10px",
      }}
    >
      <div style={{ ...dotStyle, animationDelay: "0s" }} />
      <div style={{ ...dotStyle, animationDelay: "0.2s" }} />
      <div style={{ ...dotStyle, animationDelay: "0.4s" }} />
      
      <style>{`
        @keyframes bounceDot {
          0%, 100% {
            transform: translateY(0) scale(0.7);
            opacity: 0.3;
            background-color: rgba(255, 255, 255, 0.3);
            box-shadow: none;
          }
          50% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
            background-color: #ffffff;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.45);
          }
        }
      `}</style>
    </div>
  );
};

const dotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  animation: "bounceDot 1.2s ease-in-out infinite",
};

export default Loader;