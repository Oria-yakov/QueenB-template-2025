import React from "react";
import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

import TextField from "../components/form/TextField";
import EmailField from "../components/form/EmailField";
import PasswordField from "../components/form/PasswordField";
import TextArea from "../components/form/TextArea";
import YearsExperienceField from "../components/form/YearsExperienceField";
import LanguagesMultiSelect from "../components/form/LanguagesMultiSelect";

import logo from "./queenb-logo.png";
import "./SignUp.css";

export default function SignUp() {
  const location = useLocation();

  const [role, setRole] = React.useState(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [info, setInfo] = React.useState("");

  const [years, setYears] = React.useState(0);
  const [languages, setLanguages] = React.useState([]);

  const [errors, setErrors] = React.useState({
    name: "", email: "", password: "", info: "", years: "", languages: "",
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "mentor" || r === "mentee") setRole(r);
  }, [location.search]);

  const validateName = (v) => !v.trim() ? "Required field" : v.trim().length < 2 ? "Name must be at least 2 characters" : "";
  const validateEmail = (v) => !v.trim() ? "Required field" : !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(v) ? "Invalid email" : "";
  const validatePassword = (v) => !v ? "Required field" : v.length < 8 ? "Password must be at least 8 characters" : !/[0-9]/.test(v) ? "Password must include at least one digit" : "";
  const validateInfo = (v) => (v && v.length > 500 ? "Please keep it under 500 characters" : "");
  const validateYears = (v) => role === "mentor" ? (v <= 0 ? "Please enter at least 1 year" : v > 60 ? "Please enter a realistic value (≤ 60)" : "") : "";
  const validateLanguages = (arr) => role === "mentor" ? (arr.length === 0 ? "Select at least one language" : "") : "";

  const validateAll = () => {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      info: validateInfo(info),
      years: validateYears(years),
      languages: validateLanguages(languages),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) {
      const payload = { name, email, password, info, role };
      if (role === "mentor") {
        payload.years = years;
        payload.languages = languages;
      }
      console.log("SignUp payload:", payload);
      alert(`Welcome, ${name}! (${role})`);
    }
  };

  const onBlur = (field) => () => {
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "name" ? validateName(name)
        : field === "email" ? validateEmail(email)
        : field === "password" ? validatePassword(password)
        : field === "info" ? validateInfo(info)
        : field === "years" ? validateYears(years)
        : field === "languages" ? validateLanguages(languages)
        : "",
    }));
  };

  return (
    <div className="signup-root">
      <Container maxWidth="sm">
        <Paper elevation={2} className="signup-card">

          {/* ====== TOP עם לוגו ====== */}
          <div className="signup-top">
            <img src={logo} alt="QueenB Logo" className="signup-logo" />
          </div>

          {/* ====== BOTTOM עם כל התוכן ====== */}
          <div className="signup-bottom">
            <Typography variant="h4" gutterBottom>
              Create account
            </Typography>

            {/* choose mentor or mentee */}
            {role === null && (
              <Box className="role-gate">
                <Typography className="role-gate-title" variant="h6">
                  Choose your role to continue
                </Typography>
                <div className="role-switch">
                  <Button variant="contained" onClick={() => setRole("mentor")}>Mentor</Button>
                  <Button variant="outlined" onClick={() => setRole("mentee")}>Mentee</Button>
                </div>
                <Typography className="role-gate-hint">
                  You can switch roles later.
                </Typography>
              </Box>
            )}

            {role !== null && (
              <>
                <Box className="role-switch">
                  <Button
                    variant={role === "mentor" ? "contained" : "outlined"}
                    onClick={() => setRole("mentor")}
                  >
                    Mentor
                  </Button>
                  <Button
                    variant={role === "mentee" ? "contained" : "outlined"}
                    onClick={() => setRole("mentee")}
                  >
                    Mentee
                  </Button>
                </Box>

                <form onSubmit={onSubmit} noValidate>
                  <TextField
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={setName}
                    error={errors.name}
                    onBlur={onBlur("name")}
                  />

                  <EmailField
                    id="email"
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    error={errors.email}
                    onBlur={onBlur("email")}
                  />

                  <PasswordField
                    id="password"
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    error={errors.password}
                    onBlur={onBlur("password")}
                    autoComplete="new-password"
                  />

                  <TextArea
                    id="info"
                    label="Additional info"
                    value={info}
                    onChange={setInfo}
                    error={errors.info}
                    onBlur={onBlur("info")}
                  />

                  {role === "mentor" && (
                    <>
                      <Typography variant="h6" className="section-title">
                        {/* אפשר להוסיף טקסט אם תרצי */}
                      </Typography>

                      <YearsExperienceField
                        id="years"
                        value={years}
                        onChange={setYears}
                        error={errors.years}
                      />

                      <LanguagesMultiSelect
                        id="languages"
                        value={languages}
                        onChange={setLanguages}
                        error={errors.languages}
                        onBlur={onBlur("languages")}
                      />
                    </>
                  )}

                  <div className="form-actions">
                    <Button type="submit" variant="contained" fullWidth>
                      Create account
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Paper>
      </Container>
    </div>
  );
}
