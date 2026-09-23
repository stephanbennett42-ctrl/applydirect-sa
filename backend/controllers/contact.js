import db from "../db.js";
import nodemailer from "nodemailer";

// Use the configured Gmail account to forward submitted contact messages.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    const [result] = await db.query(
      "INSERT INTO contact_messages (name, email, message, status) VALUES (?, ?, ?, ?)",
      [name, email, message, "unread"],
    );

    res.status(201).json({
      message: "Message sent successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getMessages(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateMessage(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query("UPDATE contact_messages SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.json({ message: "Message updated successfully" });
  } catch (err) {
    console.error("Update message error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
