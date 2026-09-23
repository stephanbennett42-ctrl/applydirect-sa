const { Router } = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const {
  PAYFAST_CONFIG,
  PAYFAST_PROCESS_URL,
  payfastAmount,
  generateSignature,
  verifyPaymentSignature,
  validateItnWithPayfast,
} = require("../lib/payfast");

const router = Router();

const isConfigured = () => {
  const id = PAYFAST_CONFIG.merchantId;
  const key = PAYFAST_CONFIG.merchantKey;
  return Boolean(id && key && !id.includes("your-") && !key.includes("your-"));
};

async function capturePayment(order, reason) {
  await db.query(
    "UPDATE orders SET status = ?, payment_method = ? WHERE id = ?",
    ["paid", "instant_eft", order.id],
  );
  await db.query(
    "INSERT INTO payments (order_id, amount, method, status, transaction_ref) VALUES (?, ?, ?, ?, ?)",
    [order.id, order.amount, "instant_eft", "success", reason],
  );
  await db.query("UPDATE users SET status = ? WHERE id = ? AND status = ?", [
    "approved",
    order.user_id,
    "pending",
  ]);
}

router.post("/init", requireAuth, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    if (!isConfigured()) {
      return res.status(503).json({
        error: "PayFast is not configured on the server yet",
        code: "PAYFAST_NOT_CONFIGURED",
      });
    }

    const [orderRows] = await db.query(
      `SELECT o.*, p.name AS package_name
       FROM orders o
       JOIN packages p ON o.package_id = p.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, req.user.id],
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];
    if (order.status === "paid") {
      return res.status(409).json({ error: "Order is already paid" });
    }

    const [userRows] = await db.query(
      "SELECT first_name, last_name, email FROM users WHERE id = ?",
      [req.user.id],
    );
    const user = userRows[0];

    const fields = {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      amount: payfastAmount(order.amount),
      item_name: `${order.package_name} Plan`,
      item_description: order.package_name,
      name_first: user.first_name,
      name_last: user.last_name,
      email_address: user.email,
      m_payment_id: String(order.id),
      custom_str1: String(req.user.id),
      return_url:
        PAYFAST_CONFIG.returnUrl +
        `?plan=${encodeURIComponent(order.package_name)}`,
      cancel_url: PAYFAST_CONFIG.cancelUrl,
      notify_url: PAYFAST_CONFIG.notifyUrl,
      email_confirmation: "1",
    };
    fields.signature = generateSignature(fields);

    res.json({
      processUrl: PAYFAST_PROCESS_URL,
      fields,
      orderId: Number(order.id),
      amount: Number(order.amount),
    });
  } catch (err) {
    console.error("PayFast init error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/confirm", requireAuth, async (req, res) => {
  try {
    const {
      m_payment_id,
      pf_payment_id,
      payment_status,
      amount_gross,
      signature,
    } = req.body;

    if (!m_payment_id || !signature) {
      return res
        .status(400)
        .json({ error: "Missing payment confirmation data" });
    }

    const [orderRows] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [m_payment_id, req.user.id],
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];
    if (order.status === "paid") {
      return res.json({
        message: "Payment already confirmed",
        orderId: order.id,
      });
    }

    if (!verifyPaymentSignature(req.body)) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    if (payment_status !== "COMPLETE") {
      await db.query(
        "UPDATE orders SET status = ? WHERE id = ? AND status = ?",
        ["cancelled", order.id, "pending"],
      );
      return res.json({
        message: "Payment not completed",
        status: payment_status,
      });
    }

    if (Number(amount_gross) !== Number(order.amount)) {
      return res
        .status(400)
        .json({ error: "Payment amount does not match the order" });
    }

    await capturePayment(order, pf_payment_id || "PF-" + Date.now());

    res.json({
      message: "Payment successful",
      transactionRef: pf_payment_id || "PF-" + Date.now(),
      amount: Number(order.amount),
      orderId: Number(order.id),
    });
  } catch (err) {
    console.error("PayFast confirm error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/itn", async (req, res) => {
  const data = req.body || {};

  try {
    if (!data.m_payment_id || !data.signature) {
      return res.status(400).send("Invalid ITN");
    }

    if (!verifyPaymentSignature(data)) {
      return res.status(400).send("Signature mismatch");
    }

    const valid = await validateItnWithPayfast(data);
    if (!valid) {
      return res.status(400).send("Invalid ITN");
    }

    const [orderRows] = await db.query("SELECT * FROM orders WHERE id = ?", [
      data.m_payment_id,
    ]);
    if (orderRows.length === 0) {
      return res.status(404).send("Order not found");
    }

    const order = orderRows[0];
    if (order.status === "paid") {
      return res.status(200).send("OK");
    }

    if (Number(data.amount_gross) !== Number(order.amount)) {
      return res.status(400).send("Amount mismatch");
    }

    if (data.payment_status === "COMPLETE") {
      await capturePayment(order, data.pf_payment_id || "PF-" + Date.now());
    } else {
      await db.query(
        "UPDATE orders SET status = ? WHERE id = ? AND status = ?",
        ["cancelled", order.id, "pending"],
      );
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("PayFast ITN error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;