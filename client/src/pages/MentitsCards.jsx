import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/form2/Card.jsx";
import SearchBar from "../components/form2/SearchBar.jsx";
import HeaderBar from "../components/form2/HeaderBar.jsx"; // ✅ סרגל עליון
import "./information.css";

export default function MentitsCards() {
  const [query, setQuery] = useState("");
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/mentees");
        if (!res.ok) throw new Error(`Failed to load mentees (${res.status})`);
        const data = await res.json();
        if (!alive) return;
        setMentees(data);
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
    if (!q) return mentees;
    return mentees.filter((p) =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.additional_info || "").toLowerCase().includes(q)
    );
  }, [query, mentees]);

  const handleMore = (person) => () =>
  navigate(`/mentits/${person.id}`, { state: { person } });
  const handleSearchSubmit = () => { if (filtered.length > 0) handleMore(filtered[0])(); };

  if (loading) return <main className="page" dir="rtl" style={{ padding: 24 }}>Loading mentees…</main>;
  if (err) return <main className="page" dir="rtl" style={{ padding: 24, color: "crimson" }}>{err}</main>;

  return (
    <main className="page" dir="rtl">
      {/* ✅ סרגל עליון */}
      <HeaderBar />
      <div className="header-gap" />

      {/* ✅ שורת חיפוש ממורכזת */}
      <div className="search-wrap">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearchSubmit}
          placeholder="Search by name or technology"
        />
      </div>

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
        <section className="cards-grid" role="list" aria-label="רשימת מנטיות">
          {filtered.map((p) => (
            <Card
              key={p.id}
              imageSrc={p.imageSrc || "/placeholder-avatar.png"}
              name={p.name}
              title={p.additional_info || ""}   // למנטיות מציגים מידע נוסף
              onMore={handleMore(p)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
