import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";               // ודאי שקיים
import MentorsCards from "./pages/MentorsCards"; // ודאי שקיים

const theme = createTheme({ /* ... */ });


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mentors" element={<MentorsCards />} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
