import React from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import "./Login.css";
import logo from "./queenb-logo.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  // ⬅️ כפתור Back שולח תמיד ל־Entry.jsx
  function handleBack() {
    navigate("/", { replace: true });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Login failed (status ${res.status})`);
      }

      const data = await res.json();

      if (data.role === "mentor") {
        navigate("/mentits");
      } else if (data.role === "mentee") {
        navigate("/mentors");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* כפתור BACK בצד שמאל של המסך */}
      <Button className="login-back-global" onClick={handleBack}>
        ← Back
      </Button>

      <Container maxWidth="sm">
        <Paper elevation={2} className="login-card">
          {/* TOP עם לוגו */}
          <div className="login-top">
            <img src={logo} alt="QueenB Logo" className="login-logo" />
          </div>

          {/* BOTTOM */}
          <div className="login-bottom">
            <Typography variant="h4" gutterBottom>
              Log in
            </Typography>

            <form onSubmit={onSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <div className="form-actions">
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                  {loading ? "Logging in..." : "Log in"}
                </Button>
              </div>
            </form>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
