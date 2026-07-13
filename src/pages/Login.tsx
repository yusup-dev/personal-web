import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/apiClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      localStorage.setItem("admin_token", res.token);
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ maxWidth: "400px", marginTop: "80px", color: "#fff" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>Login.</h2>

      {error && <p style={{ color: "#f87171", fontSize: "14px", marginBottom: "20px" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", color: "#9ca3af" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottomColor = "#fff")}
            onBlur={(e) => (e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.2)")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", color: "#9ca3af" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottomColor = "#fff")}
            onBlur={(e) => (e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.2)")}
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "loading..." : "login"}
        </button>
      </form>
    </section>
  );
};

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "8px 0",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const buttonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  color: "#fff",
  padding: "8px 20px",
  fontSize: "14px",
  cursor: "pointer",
  marginTop: "10px",
  alignSelf: "flex-start",
  transition: "border-color 0.2s ease",
};

export default Login;
