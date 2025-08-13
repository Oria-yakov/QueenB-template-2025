
import React, { useMemo, useState } from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { PEOPLE } from "../mentors";   
import "../index.css";

export default function MentorsCards() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PEOPLE;
    return PEOPLE.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.title || "").toLowerCase().includes(q)
    );
  }, [query]);

  const handleMore = (person) => () => {
    alert(`More details about ${person.name}`);
  };

  const handleSearchSubmit = () => {
    // Enter ב-SearchBar
    if (filtered.length > 0) {
      handleMore(filtered[0])();
    }
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
              title={p.title}
              onMore={handleMore(p)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
