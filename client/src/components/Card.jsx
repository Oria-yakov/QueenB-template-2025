
import React from "react";
import PropTypes from "prop-types";
import MoreButton from "./MoreButton";
import "./Card.css";

export default function Card({ imageSrc, name, title, onMore }) {
  return (
    <article className="card">
      <div className="card-image-wrapper">
        <img
          src={imageSrc}
          alt={`${name}'s avatar`}
          className="card-image"
        />
      </div>

      <h3 className="card-name">{name}</h3>
      <p className="card-title">{title}</p>

      <MoreButton label="More details" onClick={onMore} />
    </article>
  );
}

Card.propTypes = {
  /** התמונה של המנטורית */
  imageSrc: PropTypes.string.isRequired,
  /** שם באנגלית שמופיע מתחת לתמונה */
  name: PropTypes.string.isRequired,
  /** טייטל / תפקיד (למשל: HTML, JavaScript, Creator) */
  title: PropTypes.string.isRequired,
  /** פעולה בלחיצה על הכפתור */
  onMore: PropTypes.func,
};
