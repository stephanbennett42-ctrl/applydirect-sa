const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// GET /api/institutions (Supports optional ?province= filtering)
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
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Server error retrieving institutions" });
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
      return res.status(404).json({ success: false, message: "Institution not found" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ success: false, message: "Server error retrieving institution" });
  }
});

// POST /api/reminders (Subscribe user for institution reminders)
app.post("/api/reminders", async (req, res) => {
  const { name, phone_number, channel, institution_id } = req.body;

  if (!phone_number || !institution_id) {
    return res.status(400).json({
      success: false,
      message: "Phone number and institution ID are required.",
    });
  }

  try {
    // 1. Insert user or update details if phone exists
    await db.query(
      `INSERT INTO users (name, phone_number, channel) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE name = VALUES(name), channel = VALUES(channel)`,
      [name, phone_number, channel || "whatsapp"]
    );

    // 2. Retrieve user ID
    const [[user]] = await db.query(
      "SELECT user_id FROM users WHERE phone_number = ?",
      [phone_number]
    );

    // 3. Insert reminder subscription
    await db.query(
      `INSERT INTO institution_reminders (user_id, institution_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE notify_on_open = TRUE`,
      [user.user_id, institution_id]
    );

    res.status(201).json({
      success: true,
      message: "Reminder set successfully!",
    });
  } catch (error) {
    console.error("Reminder subscription error:", error);
    res.status(500).json({ success: false, message: "Failed to set reminder." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));