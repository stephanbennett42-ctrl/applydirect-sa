/**
 * UniApply — Subscription Server Entry Point
 * Person 2 module: Payment Plans, Checkout, Orders.
 * Express.js backend serving the REST API for the subscription frontend.
 * Connects to MySQL via XAMPP.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import packageRoutes from "./routes/packages.js";
import orderRoutes from "./routes/orders.js";
import jobsRoutes from "./routes/jobs.js";
import payfastRoutes from "./routes/payfast.js";

dotenv.config({ path: [".env", "../../../backend/.env"] });

const app = express();
const PORT = 3002;

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
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// API Routes
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/payfast", payfastRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    module: "subscription",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Start Server
// ============================================
// Bind to 0.0.0.0 so the API is reachable from other devices on the network.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`UniApply Subscription API running on http://localhost:${PORT}`);
  console.log(
    `Accessible from other devices on this network via http://<this-machine-ip>:${PORT}`,
  );
  console.log(
    `Connected to MySQL database: ${process.env.DB_NAME || "uniapply"}`,
  );
});
