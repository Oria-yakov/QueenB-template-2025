import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

  const [person, setPerson] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/mentees/${id}`);
        if (!res.ok) throw new Error(`Failed to load mentee (${res.status})`);
        const data = await res.json();
        if (!alive) return;
        setPerson(data);
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
        <button
          onClick={() => navigate(-1)}
          className="md-back-global"
          aria-label="Go back"
        >
          ← Back
        </button>

        <h2 style={{ color: "crimson" }}>{err}</h2>
        <Link to="/mentits" className="md-link-btn md-link-btn--back">
          ← Back to list
        </Link>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="md-page md-page--center" dir="ltr">
        <button
          onClick={() => navigate(-1)}
          className="md-back-global"
          aria-label="Go back"
        >
          ← Back
        </button>

        <h2>Mentit not found (id: {id})</h2>
        <Link to="/mentits" className="md-link-btn md-link-btn--back">
          ← Back to list
        </Link>
      </main>
    );
  }

  const waHref   = person.phone ? `https://wa.me/${formatWhatsApp(person.phone)}` : null;
  const telHref  = person.phone ? `tel:${person.phone}` : null;
  const mailHref = person.email ? `mailto:${person.email}` : null;

  return (
    <main className="md-page" dir="ltr">
      {/* Back button גלובלי – שמאל עליון של המסך */}
      <button
        onClick={() => navigate(-1)}
        className="md-back-global"
        aria-label="Go back"
      >
        ← Back
      </button>

      <section className="md-card" aria-label={`Details for ${person.name}`}>
        <div className="md-hero">
          {logo && <img src={logo} alt="Queens Match" className="md-logo" />}

          <img
            className="md-avatar"
            src={person.imageSrc || "/placeholder-avatar.png"}
            alt={person.name}
            width={148}
            height={148}
          />

          <div className="md-hero__text">
            <h1 className="md-name">{person.name}</h1>
            {person.email && <p className="md-sub">mentor</p>}
            {person.email && <p className="md-sub"></p>}
          </div>
        </div>

        <div className="md-body">
          {person.additional_info && (
            <section className="md-section">
              <h2 className="md-title">About</h2>
              <p className="md-text">{person.additional_info}</p>
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
                    className="md-btn"
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
