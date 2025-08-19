import React from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
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
  const { state } = useLocation(); // ✅ אם הגיע מידע מהכרטיס, נקבל אותו פה

  const [person, setPerson] = React.useState(state?.person || null);
  const [loading, setLoading] = React.useState(!state?.person);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    let alive = true;

    // ✅ אם לא הגיע מידע ב־state, נביא מהשרת
    if (!person) {
      (async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/mentors/${id}`);
          if (!res.ok) throw new Error(`Failed to load mentor (${res.status})`);
          const data = await res.json();

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
    }

    return () => {
      alive = false;
    };
  }, [id, person]); // ✅ הוספתי person כדי לסגור את האזהרה של ESLint

  // 🔹 מצבי טעינה/שגיאה
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
        <Link to="/mentors" className="back-btn">
          Back to list
        </Link>
      </main>
    );
  }

  if (!person) {
    return (
      <main className="md-page md-page--center" dir="ltr">
        <h2>Mentor not found</h2>
        <Link to="/mentors" className="back-btn">
          Back to list
        </Link>
      </main>
    );
  }

  // 🔹 הכנות ל־UI
  const langs = Array.isArray(person.languages)
    ? person.languages.join(", ")
    : person.languages || person.title || "";

  const waHref = person.phone
    ? `https://wa.me/${formatWhatsApp(person.phone)}`
    : null;
  const telHref = person.phone ? `tel:${person.phone}` : null;
  const mailHref = person.email ? `mailto:${person.email}` : null;

  return (
    <main className="md-page" dir="ltr">
      {/* ✅ כפתור Back צף בפינה */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <section className="md-card">
        <div className="md-hero">
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
                  <a className="md-btn" href={mailHref}>
                    ✉️ Email
                  </a>
                )}
                {waHref && (
                  <a
                    className="md-btn"
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp size={18} /> WhatsApp
                  </a>
                )}
                {telHref && (
                  <a className="md-btn" href={telHref}>
                    📞 Phone
                  </a>
                )}
                {person.linkedin && (
                  <a
                    className="md-btn"
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
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