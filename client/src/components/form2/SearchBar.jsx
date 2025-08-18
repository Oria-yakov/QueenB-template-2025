// src/components/SearchBar.jsx
import React from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <span className="searchbar-icon" aria-hidden>🔍</span>
      <input
        className="searchbar-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search by name…"}
      />
      {value && (
        <button type="button" className="searchbar-clear" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </form>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,       // מה לעשות בלחיצה Enter
  placeholder: PropTypes.string,
};
