import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MENTITS } from "../mentits";
import "./MentitDetails.css";
import logo from "./queenb-logo.png";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";

function formatWhatsApp(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return digits;
}

export default function MentitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const person = MENTITS.find((p) => String(p.id) === String(id));

  if (!person) {
    return (
      <main className="md-page md-page--center" dir="ltr">
        <div className="md-card" style={{ padding: 24 }}>
          <h2 className="md-title">Mentit not found (id: {id})</h2>
          <div style={{ marginTop: 12 }}>
            <Link to="/mentits" className="md-link-btn md-link-btn--back">
              ← Back to list
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const langs = Array.isArray(person.languages)
    ? person.languages.join(", ")
    : person.languages || person.title || "";

  const waHref = person.phone ? `https://wa.me/${formatWhatsApp(person.phone)}` : null;
  const telHref = person.phone ? `tel:${person.phone}` : null;
  const mailHref = person.email ? `mailto:${person.email}` : null;

  return (
    <main className="md-page" dir="ltr">
      <div className="md-topbar">
        <button
          onClick={() => navigate(-1)}
          className="md-link-btn md-link-btn--back"
          aria-label="Go back"
        >
          ← Back
        </button>

        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="md-link-btn md-btn--whatsapp"
          >
            <FaWhatsapp size={18} /> WhatsApp
          </a>
        )}
      </div>

      {/* removed role="region" to avoid jsx-a11y/no-redundant-roles */}
      <section className="md-card" aria-label={`Details for ${person.name}`}>
        <div className="md-hero">
          {logo && <img src={logo} alt="Queens Match" className="md-logo" />}

          {person.imageSrc && (
            <img
              className="md-avatar"
              src={person.imageSrc}
              alt={person.name}
              width={148}
              height={148}
            />
          )}

          <div className="md-hero__text">
            <h1 className="md-name">{person.name}</h1>
            {langs && <p className="md-sub">{langs}</p>}
          </div>
        </div>

        <div className="md-body">
          {person.additionalInfo && (
            <section className="md-section">
              <h2 className="md-title">About</h2>
              <p className="md-text">{person.additionalInfo}</p>
            </section>
          )}

          {person.yearsExperience != null && (
            <section className="md-section">
              <h2 className="md-title">Years of experience</h2>
              <p className="md-text">{person.yearsExperience}</p>
            </section>
          )}

          {(mailHref || waHref || telHref || person.linkedin) && (
            <section className="md-section">
              <h2 className="md-title">Contact</h2>
              <div className="md-actions">
                {mailHref && (
                  <a className="md-btn" href={mailHref} aria-label={`Send email to ${person.name}`}>
                    ✉️ Email
                  </a>
                )}
                {waHref && (
                  <a
                    className="md-btn md-btn--whatsapp"
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp size={18} /> WhatsApp
                  </a>
                )}
                {telHref && (
                  <a className="md-btn" href={telHref} aria-label="Phone">
                    📞 Phone
                  </a>
                )}
                {person.linkedin && (
                  <a
                    className="md-btn"
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={18} /> LinkedIn
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}