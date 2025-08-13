import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Entry from "./pages/Entry";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";             
import MentorsCards from "./pages/MentorsCards"; 

const theme = createTheme({ /* ... */ });


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Entry" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mentors" element={<MentorsCards />} />
          <Route path="/Entry" element={<Entry />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
