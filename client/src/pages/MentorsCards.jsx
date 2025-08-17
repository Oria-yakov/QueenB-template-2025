import React, { useMemo, useState } from "react";
import Card from "../components/form2/Card.jsx";
import SearchBar from "../components/form2/SearchBar.jsx";
import { PEOPLE } from "../mentors";
import "./information.css";
import { useNavigate } from "react-router-dom";

export default function MentorsCards() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // ← להזיז לפה (לתוך הקומפוננטה)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PEOPLE;

    return PEOPLE.filter((p) => {
      const langs = Array.isArray(p.languages) ? p.languages.join(" ") : (p.languages || "");
      return (
        p.name.toLowerCase().includes(q) ||
        langs.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const handleMore = (person) => () => {
    navigate(`/mentors/${person.id}`);
  };

  const handleSearchSubmit = () => {
    if (filtered.length > 0) handleMore(filtered[0])();
  };

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
              imageSrc={p.imageSrc}
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
