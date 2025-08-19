import { useEffect, useState } from "react";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (alive) setUser(data);
        } else {
          // fallback קל אם אין אנדפוינט:
          const name = localStorage.getItem("name");
          const role = localStorage.getItem("role");
          const imageUrl = localStorage.getItem("imageUrl");
          if (alive && (name || role || imageUrl)) {
            setUser({ name, role, imageUrl });
          }
        }
      } catch {
        // התעלמות – משתמש לא מחובר
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { user, loading };
}
