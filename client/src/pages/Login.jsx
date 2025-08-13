import React from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: call API
    console.log("Login payload:", { email, password });
    alert(`Logging in as: ${email}`);
  };

  return (
    <div className="login-root">
      <Container maxWidth="sm">
        <Paper elevation={2} className="login-card">
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

            <div className="form-actions">
              <Button type="submit" variant="contained" fullWidth>
                Log in
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
