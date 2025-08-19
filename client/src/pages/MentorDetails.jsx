// src/pages/MentorDetails.jsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./MentorDetails.css";
import logo from "./queenb-logo.png";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";

function formatWhatsApp(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return digits;
}

export default function MentorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/mentors/${id}`);
        if (!res.ok) throw new Error(`Failed to load mentor (${res.status})`);
        const data = await res.json();

        // normalize languages: array or []
        let languages = [];
        if (data.languages != null) {
          try {
            languages = Array.isArray(data.languages)
              ? data.languages
              : JSON.parse(data.languages);
          } catch {
            languages = [];
          }
        }

        const normalized = { ...data, languages };
        if (alive) setPerson(normalized);
      } catch (e) {
        if (alive) setErr(e.message || "Load error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <main className="md-page md-page--center" dir="ltr">
        <h2>Loading…</h2>
      </main>
    );
  }

  if (err) {
    return (
      <main className="md-page md-page--center" dir="ltr">
        <h2 style={{ color: "crimson" }}>{err}</h2>
        <Link to="/mentors" className="md-link-btn">Back to list</Link>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="md-page md-page--center" dir="ltr">
        <h2>Mentor not found</h2>
        <Link to="/mentors" className="md-link-btn">Back to list</Link>
      </main>
    );
  }

  const langs = Array.isArray(person.languages)
    ? person.languages.join(", ")
    : (person.languages || person.title || "");

  // מהשרת כרגע יש לנו תמיד email, אולי אין phone/linkedin/imageSrc – נציג רק מה שקיים
  const waHref   = person.phone ? `https://wa.me/${formatWhatsApp(person.phone)}` : null;
  const telHref  = person.phone ? `tel:${person.phone}` : null;
  const mailHref = person.email ? `mailto:${person.email}` : null;

  return (
    <main className="md-page" dir="ltr">
      <button onClick={() => navigate(-1)} className="md-link-btn md-link-btn--back">
        ← Back
      </button>

      <section className="md-card">
        <div className="md-hero">
          {/* Company logo (top-right) */}
          <img src={logo} alt="Company Logo" className="md-logo" />

          <div className="md-hero__text">
            <h1 className="md-name">{person.name}</h1>
            {langs && <p className="md-sub">{langs}</p>}
          </div>

          <img
            className="md-avatar"
            src={person.imageSrc || "/placeholder-avatar.png"}
            alt={person.name}
            width={148}
            height={148}
          />
        </div>

        <div className="md-body">
          {person.additional_info && (
            <div className="md-section">
              <h2 className="md-title">About</h2>
              <p className="md-text">{person.additional_info}</p>
            </div>
          )}

          {person.years_exp != null && (
            <div className="md-section">
              <h2 className="md-title">Years of experience</h2>
              <p className="md-text">{person.years_exp}</p>
            </div>
          )}

          {(mailHref || waHref || telHref || person.linkedin) && (
            <div className="md-section">
              <h2 className="md-title">Contact</h2>
              <div className="md-actions">
                {mailHref && (
                  <a className="md-btn" href={mailHref} aria-label="Send email">
                    ✉️ Email
                  </a>
                )}
                {waHref && (
                  <a className="md-btn" href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                    <FaWhatsapp size={18} /> WhatsApp
                  </a>
                )}
                {telHref && (
                  <a className="md-btn" href={telHref} aria-label="Phone">
                    📞 Phone
                  </a>
                )}
                {person.linkedin && (
                  <a className="md-btn" href={person.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <FaLinkedin size={18} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}