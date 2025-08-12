import React from "react";

export default function FirstNameField({
  id = "firstName",
  label = "First name",
  placeholder = "e.g., Noa",
  value,
  onChange,
  error,
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        htmlFor={id}
        style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="given-name"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #d1d5db",
          fontSize: 14,
        }}
      />
      {error && (
        <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}