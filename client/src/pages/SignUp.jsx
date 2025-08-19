import React from "react";
import {
  Container, Paper, Typography, Button, Box, TextField as MuiTextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"; // ⬅️ אייקון חזרה
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const submittingRef = React.useRef(false);
  const fileInputRef = React.useRef(null);

  const [role, setRole] = React.useState(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [info, setInfo] = React.useState("");

  const [years, setYears] = React.useState(0);
  const [languages, setLanguages] = React.useState([]);

  // profile fields
  const [phone, setPhone] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageUploading, setImageUploading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    name: "", email: "", password: "", info: "", years: "", languages: "",
    phone: "", linkedin: "",
  });

  // Success dialog
  const [successOpen, setSuccessOpen] = React.useState(false);
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate("/login");
  };
  const handleDialogClose = (_e, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
    handleSuccessClose();
  };

  // ⬅️ כפתור Back שולח תמיד לעמוד Entry.jsx ("/")
  function handleBack() {
    navigate("/", { replace: true });
  }

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "mentor" || r === "mentee") setRole(r);
  }, [location.search]);

  const validateName = (v) =>
    !v.trim() ? "Required field" :
    v.trim().length < 2 ? "Name must be at least 2 characters" : "";

  const validateEmail = (v) =>
    !v.trim() ? "Required field" :
    !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(v) ? "Invalid email" : "";

  const validatePassword = (v) =>
    !v ? "Required field" :
    v.length < 8 ? "Password must be at least 8 characters" :
    !/[0-9]/.test(v) ? "Password must include at least one digit" : "";

  const validateInfo = (v) => (v && v.length > 500 ? "Please keep it under 500 characters" : "");

  const validateYears = (v) =>
    role === "mentor"
      ? (v <= 0 ? "Please enter at least 1 year" : v > 60 ? "Please enter a realistic value (≤ 60)" : "")
      : "";

  const validateLanguages = (arr) =>
    role === "mentor" ? (arr.length === 0 ? "Select at least one language" : "") : "";

  const validatePhone = (v) => {
    if (!v) return "";
    const digits = v.replace(/\D/g, "");
    return digits.length < 8 || digits.length > 15 ? "Enter a valid phone number" : "";
  };

  const validateLinkedin = (v) => {
    if (!v) return "";
    return /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(v) ? "" : "Enter a valid LinkedIn URL";
  };

  const validateAll = () => {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      info: validateInfo(info),
      years: validateYears(years),
      languages: validateLanguages(languages),
      phone: validatePhone(phone),
      linkedin: validateLinkedin(linkedin),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    if (submittingRef.current) return;
    submittingRef.current = true;

    const payload = {
      name,
      email,
      password,
      info,
      role,
      ...(role === "mentor" ? { years, languages } : {}),
      phone: phone || null,
      linkedin: linkedin || null,
      imageUrl: imageUrl || null,
    };

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Signup failed (status ${res.status})`);
      }
      const data = await res.json();
      console.log("Signed up:", data);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      submittingRef.current = false;
    }
  }

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
        : field === "phone" ? validatePhone(phone)
        : field === "linkedin" ? validateLinkedin(linkedin)
        : "",
    }));
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${res.status})`);
      }
      const out = await res.json(); // { url: "/uploads/xxxx.jpg" }
      setImageUrl(out.url);
    } catch (e1) {
      alert(e1.message || "Upload failed");
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="signup-root">
      {/* ⬅️ כפתור Back קבוע */}
      <Button className="signup-back-global" onClick={handleBack} startIcon={<ArrowBackIosNewIcon />}>
        Back
      </Button>

      <Container maxWidth="sm">
        <Paper elevation={2} className="signup-card">
          <div className="signup-top">
            <img src={logo} alt="QueenB Logo" className="signup-logo" />
          </div>

          <div className="signup-bottom">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Create account
            </Typography>

            {/* Pink role chip */}
            {role && (
              <Chip
                label={role === "mentor" ? "Signing up as Mentor" : "Signing up as Mentee"}
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  borderRadius: 999,
                  px: 1.5,
                  bgcolor: role === "mentor" ? "#ad1457" : "#f8bbd0",
                  color: role === "mentor" ? "#fff" : "#880e4f",
                }}
              />
            )}

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
                  <TextField required
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={setName}
                    error={errors.name}
                    onBlur={onBlur("name")}
                  />

                  <EmailField required
                    id="email"
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    error={errors.email}
                    onBlur={onBlur("email")}
                  />

                  <PasswordField required
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
                      <Typography variant="h6" className="section-title"></Typography>

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

                  <MuiTextField
                    id="phone"
                    label="Phone "
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={onBlur("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    fullWidth
                    margin="normal"
                  />

                  <MuiTextField
                    id="linkedin"
                    label="LinkedIn URL "
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    onBlur={onBlur("linkedin")}
                    error={!!errors.linkedin}
                    helperText={errors.linkedin}
                    fullWidth
                    margin="normal"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <div className="upload-actions">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={openFilePicker}
                      disabled={imageUploading}
                    >
                      {imageUploading ? "Uploading..." : "Upload  photo"}
                    </Button>
                    {imageUrl && (
                      <Button type="button" variant="text" onClick={() => setImageUrl("")}>
                        Remove image
                      </Button>
                    )}
                  </div>

                  {imageUrl && (
                    <Box className="upload-preview">
                      <img
                        className="preview-img"
                        src={imageUrl}
                        alt="Preview"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    </Box>
                  )}

                  <div className="form-actions">
                    <Button type="submit" variant="contained" fullWidth disabled={imageUploading}>
                      Create account
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={successOpen}
        onClose={handleDialogClose}
        aria-labelledby="signup-success-title"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxWidth: 420,
          },
          elevation: 3,
        }}
        slotProps={{ backdrop: { sx: { backdropFilter: "blur(2px)" } } }}
      >
        <DialogTitle
          id="signup-success-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 700,
            justifyContent: "center",
            textAlign: "center",
            pb: 0,
            color: "#ad1457",
          }}
        >
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 28, color: "#d81b60" }} />
          Account created
        </DialogTitle>

        <DialogContent
          sx={{
            textAlign: "center",
            pt: 1.5,
            "& p": { mt: 0.5, color: "text.secondary" }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            You’re all set! 🎉
          </Typography>
          <Typography variant="body1">
            Your account was created successfully. You can now log in to continue.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pt: 1, pb: 2 }}>
          <Button
            onClick={handleSuccessClose}
            variant="contained"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#d81b60",
              "&:hover": { bgcolor: "#ad1457" },
            }}
            autoFocus
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
