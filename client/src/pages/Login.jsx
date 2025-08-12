import React from "react";

export default function Login() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", direction: "rtl" }}>
      <div style={{ width: 320, textAlign: "center" }}>
        <h1>ברוכים הבאים</h1>
        <p>בחר את סוג המשתמש:</p>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <button style={{ padding: "12px 16px", fontSize: 16 }}>
            אני מנטית
          </button>

          <button style={{ padding: "12px 16px", fontSize: 16 }}>
            אני מנטורית
          </button>
        </div>
      </div>
    </div>
  );
}