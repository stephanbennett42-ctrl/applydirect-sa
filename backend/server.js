require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Team database connection
const db = require("./db");

// Profile and Contact use the callback-based connection in config/db.js
const portfolioRoutes = require("./routes/profile");
const contactRoutes = require("./routes/contact");

const app = express();

app.use(cors());
app.use(express.json());


// =====================================================
// INSTITUTIONS API
// =====================================================

// GET /api/institutions
// Supports optional ?province= and ?status= filtering.
app.get("/api/institutions", async (req, res) => {
  try {
    const { province, status } = req.query;

    let sql = "SELECT * FROM institutions";
    const params = [];
    const conditions = [];

    if (province) {
      conditions.push("province = ?");
      params.push(province);
    }

    if (status) {
      conditions.push("application_status = ?");
      params.push(status);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY name ASC";

    const [rows] = await db.query(sql, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Database query error:", error);

    res.status(500).json({
      success: false,
      message: "Server error retrieving institutions"
    });
  }
});


// GET /api/institutions/:id
app.get("/api/institutions/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM institutions WHERE institution_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Institution not found"
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error("Database query error:", error);

    res.status(500).json({
      success: false,
      message: "Server error retrieving institution"
    });
  }
});


// =====================================================
// REMINDERS API
// =====================================================

// POST /api/reminders
// Subscribe a user to institution reminders.
app.post("/api/reminders", async (req, res) => {
  const {
    name,
    phone_number,
    channel,
    institution_id
  } = req.body;

  if (!phone_number || !institution_id) {
    return res.status(400).json({
      success: false,
      message: "Phone number and institution ID are required."
    });
  }

  try {

    // Insert user or update existing user with the same phone number.
    await db.query(
      `INSERT INTO users (name, phone_number, channel)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       channel = VALUES(channel)`,
      [
        name || "Valued Student",
        phone_number,
        channel || "web"
      ]
    );

    // Retrieve the user's ID.
    const [[user]] = await db.query(
      "SELECT user_id FROM users WHERE phone_number = ?",
      [phone_number]
    );

    // Create or reactivate the institution reminder.
    await db.query(
      `INSERT INTO institution_reminders (user_id, institution_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE notify_on_open = TRUE`,
      [
        user.user_id,
        institution_id
      ]
    );

    res.status(201).json({
      success: true,
      message: "Reminder set successfully!"
    });

  } catch (error) {
    console.error("Reminder subscription error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to set reminder."
    });
  }
});


// =====================================================
// PROFILE / PORTFOLIO API
// =====================================================

app.use("/api/portfolio", portfolioRoutes);


// =====================================================
// CONTACT US API
// =====================================================

app.use(
  "/api/contact",
  (req, res, next) => {
    console.log(
      "CONTACT REQUEST:",
      req.method,
      req.originalUrl
    );

    next();
  },
  contactRoutes
);


// =====================================================
// ROOT / SERVER TEST
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "ApplyDirect-SA Backend is running",
    test: "THIS IS MY BACKEND"
  });
});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});