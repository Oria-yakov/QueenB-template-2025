// index.js (server)

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "Oria706385",
  database: "queens_match",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
};

let pool;
async function initDb() {
  pool = await mysql.createPool(DB_CONFIG);
  const [rows] = await pool.query("SELECT 1 AS ok");
  console.log("✅ MySQL connected. Test:", rows[0]);
}

// ===== uploads =====
const UPLOAD_DIR = path.join(__dirname, "uploads");
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log("📁 uploads dir:", UPLOAD_DIR);
} catch (e) {
  console.error("❌ cannot create uploads dir:", e);
}

// storage & multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    // מאשר כל image/* כדי למנוע דחייה על HEIC וכו'
    if (/^image\//i.test(file.mimetype)) return cb(null, true);
    return cb(new Error("Only image files are allowed"));
  },
});

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR)); // serve images

// === Helpers ===
function normalizeMentor(row) {
  let langs = [];
  if (row.languages != null) {
    try {
      langs = typeof row.languages === "string" ? JSON.parse(row.languages) : row.languages;
    } catch {
      langs = [];
    }
  }
  return { ...row, languages: Array.isArray(langs) ? langs : [] };
}

// === Health ===
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// === DB Ping ===
app.get("/api/ping-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: "up", result: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "down", error: err.message });
  }
});

// === Upload endpoint ===
app.post("/api/upload", (req, res) => {
  // עוטף את multer כדי לתפוס שגיאות ולהחזיר הודעות ברורות
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large (max 5MB)" });
      }
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.json({ url: `/uploads/${req.file.filename}` });
  });
});

// === SIGNUP ===
app.post("/api/users/signup", async (req, res) => {
  try {
    const {
      name, email, password, info, role, years, languages,
      phone, linkedin, imageUrl, // imageUrl -> image_url
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    if (role === "mentor") {
      const [result] = await pool.query(
        `INSERT INTO mentors
          (full_name, email, password_hash, additional_info, years_exp, languages, phone, linkedin, image_url)
         VALUES (?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?, ?)`,
        [
          name, email, password_hash,
          info || null, years || null, JSON.stringify(languages || []),
          phone || null, linkedin || null, imageUrl || null,
        ]
      );
      return res.status(201).json({ id: result.insertId, role: "mentor", name, email });
    }

    if (role === "mentee") {
      const [result] = await pool.query(
        `INSERT INTO mentees
          (full_name, email, password_hash, additional_info, phone, linkedin, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password_hash, info || null, phone || null, linkedin || null, imageUrl || null]
      );
      return res.status(201).json({ id: result.insertId, role: "mentee", name, email });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// === LOGIN ===
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // mentor
    const [mentors] = await pool.query(
      `SELECT id, full_name, email, password_hash FROM mentors WHERE email = ? LIMIT 1`,
      [email]
    );
    if (mentors.length > 0) {
      const mentor = mentors[0];
      const match = await bcrypt.compare(password, mentor.password_hash);
      if (!match) return res.status(401).json({ message: "Invalid password" });
      return res.json({ id: mentor.id, role: "mentor", name: mentor.full_name, email: mentor.email });
    }

    // mentee
    const [mentees] = await pool.query(
      `SELECT id, full_name, email, password_hash FROM mentees WHERE email = ? LIMIT 1`,
      [email]
    );
    if (mentees.length > 0) {
      const mentee = mentees[0];
      const match = await bcrypt.compare(password, mentee.password_hash);
      if (!match) return res.status(401).json({ message: "Invalid password" });
      return res.json({ id: mentee.id, role: "mentee", name: mentee.full_name, email: mentee.email });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === LIST ALL MENTORS (for mentees) ===
app.get("/api/mentors", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id,
             full_name AS name,
             email,
             years_exp,
             languages,
             additional_info,
             phone,
             linkedin,
             image_url AS imageSrc,
             created_at
      FROM mentors
      ORDER BY id DESC
    `);
    res.json(rows.map(normalizeMentor));
  } catch (err) {
    console.error("❌ Error fetching mentors:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === LIST ALL MENTEES (for mentors) ===
app.get("/api/mentees", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id,
             full_name AS name,
             email,
             additional_info,
             phone,
             linkedin,
             image_url AS imageSrc,
             created_at
      FROM mentees
      ORDER BY id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching mentees:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === SINGLE MENTOR BY ID ===
app.get("/api/mentors/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name AS name, email, years_exp, languages, additional_info, phone, linkedin, image_url AS imageSrc, created_at
       FROM mentors WHERE id = ? LIMIT 1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(normalizeMentor(rows[0]));
  } catch (err) {
    console.error("❌ Error fetching mentor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === SINGLE MENTEE BY ID ===
app.get("/api/mentees/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name AS name, email, additional_info, phone, linkedin, image_url AS imageSrc, created_at
       FROM mentees WHERE id = ? LIMIT 1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching mentee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === 404 (must be last) ===
app.use("*", (_req, res) => res.status(404).json({ error: "Route not found" }));

// === Start ===
const PORT = 5000;
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📱 Health:  http://localhost:${PORT}/api/health`);
      console.log(`🗄  DB ping: http://localhost:${PORT}/api/ping-db`);
      console.log(`🧪 Test POST: http://localhost:${PORT}/api/users/signup`);
      console.log(`🖼  Uploads served from /uploads`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to init DB:", err.message);
    process.exit(1);
  });
