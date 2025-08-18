import React from "react";
import { useNavigate } from "react-router-dom";
import "./Entry.css";
import logo from "./queenb-logo.png"; 

export default function Entry() {
  const navigate = useNavigate();

  return (
    <div className="entry-root">
      <div className="entry-card">
        {/* עליון – לבן + לוגו */}
        <div className="entry-top">
          <img className="entry-logo" src={logo} alt="QueenB logo" />
        </div>

        {/* תחתון – ורוד מעוגל */}
        <div className="entry-bottom">
          <h1 className="title">Welcome</h1>
          <p className="subtitle">
            Match mentors & mentees in a friendly, growing community.
          </p>

          <div className="entry-actions">
            <button className="btn primary-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn secondary-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
