const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET, requireAuth } = require("../middleware/auth");

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      university,
      fieldOfStudy,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "First name, last name, email, and password are required",
      });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const [result] = await db.query(
      "INSERT INTO users (first_name, last_name, email, password, phone, university, field_of_study, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        phone || null,
        university || null,
        fieldOfStudy || null,
        "pending",
        "student",
      ],
    );

    res.status(201).json({
      message: "Account created. Awaiting admin approval.",
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        university: university || null,
        fieldOfStudy: fieldOfStudy || null,
        status: "pending",
        role: "student",
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        error: "Your account is pending admin approval.",
        status: "pending",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        error: "Your account has been rejected. Please contact support.",
        status: "rejected",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        university: user.university,
        fieldOfStudy: user.field_of_study,
        status: user.status,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, first_name, last_name, email, phone, university, field_of_study, status, role, registered_date FROM users WHERE id = ?",
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const u = rows[0];
    res.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      university: u.university,
      fieldOfStudy: u.field_of_study,
      status: u.status,
      role: u.role,
      registeredDate: u.registered_date,
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;