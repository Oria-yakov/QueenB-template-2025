import React from "react";
import { useNavigate } from "react-router-dom";
import "./Entry.css";

export default function Entry() {
  const navigate = useNavigate();

  return (
    <div className="entry-root">
      <div className="entry-card">
        <h1 className="title">Welcome</h1>
        <p className="subtitle">Choose an option:</p>

        <div className="entry-actions">
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button className="secondary-btn" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
