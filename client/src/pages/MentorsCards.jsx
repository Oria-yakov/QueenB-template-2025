import React, { useEffect, useMemo, useState } from "react";
import Card from "../components/form2/Card.jsx";
import SearchBar from "../components/form2/SearchBar.jsx";
import "./information.css";
import { useNavigate } from "react-router-dom";

export default function MentorsCards() {
  const [query, setQuery] = useState("");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/mentors");
        if (!res.ok) throw new Error(`Failed to load mentors (${res.status})`);
        const data = await res.json();

        if (!alive) return;
        // languages יכולה להגיע כמחרוזת JSON או כ-null
        const normalized = data.map((m) => {
          let langs = [];
          if (m.languages != null) {
            try {
              langs = Array.isArray(m.languages)
                ? m.languages
                : JSON.parse(m.languages);
            } catch {
              langs = [];
            }
          }
          return { ...m, languages: langs };
        });

        setMentors(normalized);
      } catch (e) {
        setErr(e.message || "Load error");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mentors;

    return mentors.filter((p) => {
      const langs = Array.isArray(p.languages) ? p.languages.join(" ") : (p.languages || "");
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (langs || "").toLowerCase().includes(q)
      );
    });
  }, [query, mentors]);

  const handleMore = (person) => () => {
    navigate(`/mentors/${person.id}`);
  };

  const handleSearchSubmit = () => {
    if (filtered.length > 0) handleMore(filtered[0])();
  };

  if (loading) {
    return <main className="page" dir="rtl" style={{ padding: 24 }}>Loading mentors…</main>;
  }
  if (err) {
    return <main className="page" dir="rtl" style={{ padding: 24, color: "crimson" }}>{err}</main>;
  }

  return (
    <main className="page" dir="rtl">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearchSubmit}
        placeholder="Search by name or technology"
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", opacity: 0.75 }}>
          <p>No results found for “{query}”.</p>
          <button
            onClick={() => setQuery("")}
            style={{ border: "1px solid #ddd", borderRadius: 10, padding: "6px 12px", cursor: "pointer" }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <section className="cards-grid" role="list" aria-label="רשימת מנטוריות">
          {filtered.map((p) => (
            <Card
              key={p.id}
              imageSrc={p.imageSrc || "/placeholder-avatar.png"}  // fallback אם אין תמונה
              name={p.name}
              title={Array.isArray(p.languages) ? p.languages.join(", ") : p.languages}
              onMore={handleMore(p)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
