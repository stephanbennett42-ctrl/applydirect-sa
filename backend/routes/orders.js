const { Router } = require("express");
const crypto = require("crypto");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ error: "Package ID is required" });
    }

    const [pkgRows] = await db.query("SELECT * FROM packages WHERE id = ?", [
      packageId,
    ]);
    if (pkgRows.length === 0) {
      return res.status(404).json({ error: "Package not found" });
    }

    const pkg = pkgRows[0];

    const [existingOrders] = await db.query(
      "SELECT id FROM orders WHERE user_id = ? AND package_id = ? AND status = ?",
      [req.user.id, packageId, "paid"],
    );
    if (existingOrders.length > 0) {
      return res
        .status(409)
        .json({ error: "You already have an active order for this package" });
    }

    const isFree = Number(pkg.price) <= 0;
    const orderStatus = isFree ? "paid" : "pending";

    const [result] = await db.query(
      "INSERT INTO orders (user_id, package_id, amount, status) VALUES (?, ?, ?, ?)",
      [req.user.id, packageId, pkg.price, orderStatus],
    );

    if (isFree) {
      await db.query(
        "INSERT INTO payments (order_id, amount, method, status, transaction_ref) VALUES (?, ?, ?, ?, ?)",
        [result.insertId, 0, "free", "success", "FREE-" + result.insertId],
      );
      await db.query(
        "UPDATE users SET status = ? WHERE id = ? AND status = ?",
        ["approved", req.user.id, "pending"],
      );
    }

    res.status(201).json({
      id: result.insertId,
      userId: req.user.id,
      packageId,
      amount: Number(pkg.price),
      status: orderStatus,
      packageName: pkg.name,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/pay", requireAuth, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { cardNumber, cardHolder, expiry, cvv, paymentMethod } = req.body;
    const method = ["credit_card", "bank_transfer", "instant_eft"].includes(
      paymentMethod,
    )
      ? paymentMethod
      : "credit_card";

    const [orderRows] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, req.user.id],
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];
    if (order.status === "paid") {
      return res.status(409).json({ error: "Order is already paid" });
    }

    let cardLastFour = null;
    if (method === "credit_card") {
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        return res.status(400).json({ error: "All card details are required" });
      }

      const cleanCard = cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanCard)) {
        return res
          .status(400)
          .json({ error: "Invalid card number — must be 16 digits" });
      }

      cardLastFour = cleanCard.slice(-4);
    }

    const transactionRef =
      "TXN-" +
      Date.now() +
      "-" +
      crypto.randomBytes(4).toString("hex").toUpperCase();

    await db.query(
      "UPDATE orders SET status = ?, payment_method = ? WHERE id = ?",
      ["paid", method, orderId],
    );

    await db.query(
      "INSERT INTO payments (order_id, amount, method, card_last_four, status, transaction_ref) VALUES (?, ?, ?, ?, ?, ?)",
      [orderId, order.amount, method, cardLastFour, "success", transactionRef],
    );

    await db.query("UPDATE users SET status = ? WHERE id = ? AND status = ?", [
      "approved",
      req.user.id,
      "pending",
    ]);

    res.json({
      message: "Payment successful",
      transactionRef,
      cardLastFour,
      amount: Number(order.amount),
      orderId: Number(orderId),
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Server error during payment processing" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.*, p.name as package_name, p.description as package_description
       FROM orders o
       JOIN packages p ON o.package_id = p.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id],
    );

    res.json(
      rows.map((o) => ({
        id: o.id,
        packageId: o.package_id,
        packageName: o.package_name,
        packageDescription: o.package_description,
        amount: Number(o.amount),
        status: o.status,
        paymentMethod: o.payment_method,
        createdAt: o.created_at,
      })),
    );
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const [orderRows] = await db.query(
      `SELECT o.*, p.name as package_name
       FROM orders o
       JOIN packages p ON o.package_id = p.id
       WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, req.user.id],
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const o = orderRows[0];

    const [payRows] = await db.query(
      "SELECT * FROM payments WHERE order_id = ?",
      [o.id],
    );

    res.json({
      id: o.id,
      packageName: o.package_name,
      amount: Number(o.amount),
      status: o.status,
      paymentMethod: o.payment_method,
      payment:
        payRows.length > 0
          ? {
              transactionRef: payRows[0].transaction_ref,
              cardLastFour: payRows[0].card_last_four,
              status: payRows[0].status,
              createdAt: payRows[0].created_at,
            }
          : null,
      createdAt: o.created_at,
    });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;