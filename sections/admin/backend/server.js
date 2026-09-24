/**
 * UniApply — Admin Server Entry Point
 * Person 4 module: AdminLogin, AdminDashboard.
 * Express.js backend serving the REST API for the admin frontend.
 * Connects to MySQL via XAMPP.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/adminauth.js";
import adminRoutes from "./routes/admin.js";
import jobsRoutes from "./routes/jobs.js";
import placementsRoutes from "./routes/placements.js";

dotenv.config({ path: [".env", "../../../backend/.env"] });

const app = express();
const PORT = process.env.PORT || 3003;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================
// Middleware
// ============================================
// CORS: reflect the request origin so the app works from any device
// (localhost AND other machines/phones on the network).
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// API Routes
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/jobs", jobsRoutes);
app.use("/api/admin/placements", placementsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    module: "admin",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Static SPA (production build of the admin frontend)
// Serves sections/admin/frontend/dist if it exists, with a SPA fallback.
// ============================================
const distDir = path.join(__dirname, "..", "frontend", "dist");

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
  console.log(`Serving admin frontend from ${distDir}`);
}

// ============================================
// Start Server
// ============================================
// Bind to 0.0.0.0 so the API is reachable from other devices on the network.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`UniApply Admin API running on http://localhost:${PORT}`);
  console.log(
    `Accessible from other devices on this network via http://<this-machine-ip>:${PORT}`,
  );
  console.log(
    `Connected to MySQL database: ${process.env.DB_NAME || "uniapply"}`,
  );
});
