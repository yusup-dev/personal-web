import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid configurations for a sleek dark theme
mermaid.initialize({
  startOnLoad: false, // Disabled auto-scan to prevent React lifecycle conflicts
  theme: "dark",
  securityLevel: "loose",
  flowchart: { useMaxWidth: true },
  sequence: { useMaxWidth: true },
  er: { useMaxWidth: true },
  gantt: { useMaxWidth: true },
  journey: { useMaxWidth: true },
  class: { useMaxWidth: true },
  state: { useMaxWidth: true },
  pie: { useMaxWidth: true },
  themeVariables: {
    background: "#121212",
    primaryColor: "#6366f1",
    primaryTextColor: "#ffffff",
    lineColor: "rgba(255, 255, 255, 0.2)",
    nodeBorder: "rgba(255, 255, 255, 0.15)",
    mainBkg: "rgba(255, 255, 255, 0.03)",
  }
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      try {
        setError(false);
        // Generate a unique ID for each render task
        const id = `mermaid-${Math.floor(Math.random() * 1000000)}`;
        
        // Clean/sanitize the chart string (remove HTML entities or escape tags if any)
        const cleanChart = chart
          .replace(/&gt;/g, ">")
          .replace(/&lt;/g, "<")
          .replace(/&amp;/g, "&");

        const { svg: renderedSvg } = await mermaid.render(id, cleanChart);
        
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div
        style={{
          margin: "24px 0",
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          padding: "16px 20px",
          borderRadius: "8px",
          color: "#f87171",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600 }}>[Mermaid Render Error]</span>
        <pre
          style={{
            marginTop: "8px",
            fontSize: "12px",
            fontFamily: "Consolas, monospace",
            overflowX: "auto",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-container"
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "24px 0",
        background: "#121212",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <div 
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
        dangerouslySetInnerHTML={{ __html: svg }} 
      />
      <style>{`
        .mermaid-container svg {
          max-width: 100% !important;
          height: auto !important;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Mermaid;
