import React from "react";
import PropTypes from "prop-types";
import "./MoreButton.css"; // ייבוא ה-CSS הספציפי

export default function MoreButton({ label = "More details", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="more-button"
      aria-label={label}
    >
      {label}
    </button>
  );
}

MoreButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
};
