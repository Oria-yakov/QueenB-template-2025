import React from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import TextField from "../components/form/TextField";

export default function SignUp() {
  const [firstName, setFirstName] = React.useState("");
  const [error, setError] = React.useState("");

  const validate = (v) => {
    if (!v.trim()) return "Required field";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const err = validate(firstName);
    setError(err);
    if (!err) {
      alert(`Name: ${firstName}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>Sign Up</Typography>

        <form onSubmit={onSubmit} noValidate>
          <TextField
            id="firstName"
            label="First name"
            placeholder="e.g., Noa"
            value={firstName}
            onChange={(v) => {
              setFirstName(v);
              if (error) setError(validate(v));
            }}
            error={error}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Save
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
