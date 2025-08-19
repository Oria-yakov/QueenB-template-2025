import React from "react";
import { useNavigate } from "react-router-dom";
import useCurrentUser from "../../useCurrentUser";
import logo from "../../pages/queenb-logo.png"; 
import "./HeaderBar.css";

export default function HeaderBar() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <header className="header-bar">
      <img src={logo} alt="Logo" className="header-logo" />

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
