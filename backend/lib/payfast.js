const crypto = require("crypto");
require("dotenv").config();

const SANDBOX = process.env.PAYFAST_SANDBOX === "true";

const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY,
  passphrase: process.env.PAYFAST_PASSPHRASE || null,
  returnUrl: process.env.PAYFAST_RETURN_URL || "http://localhost:3004/payment/return",
  cancelUrl: process.env.PAYFAST_CANCEL_URL || "http://localhost:3004/payment-plan",
  notifyUrl: process.env.PAYFAST_NOTIFY_URL || "http://localhost:3002/api/payfast/itn",
};

const PAYFAST_PROCESS_URL = SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

const PAYFAST_VALIDATE_URL = SANDBOX
  ? "https://sandbox.payfast.co.za/eng/query/validate"
  : "https://www.payfast.co.za/eng/query/validate";

function payfastUrlEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, "+").replace(/%7E/g, "~");
}

function payfastAmount(amount) {
  return Number(amount).toFixed(2);
}

function generateSignature(params) {
  const keys = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .sort();
  let str = keys.map((k) => `${payfastUrlEncode(k)}=${payfastUrlEncode(params[k])}`).join("&");
  if (PAYFAST_CONFIG.passphrase) {
    str += `&passphrase=${payfastUrlEncode(PAYFAST_CONFIG.passphrase)}`;
  }
  return crypto.createHash("md5").update(str).digest("hex");
}

function verifyPaymentSignature(params) {
  const received = params.signature;
  if (!received) return false;
  const { signature, ...rest } = params;
  return received === generateSignature(rest);
}

async function validateItnWithPayfast(params) {
  try {
    const { signature, ...rest } = params;
    let query = Object.keys(rest)
      .map((k) => `${payfastUrlEncode(k)}=${payfastUrlEncode(rest[k])}`)
      .join("&");
    if (PAYFAST_CONFIG.passphrase) {
      query += `&passphrase=${payfastUrlEncode(PAYFAST_CONFIG.passphrase)}`;
    }
    const res = await fetch(`${PAYFAST_VALIDATE_URL}?${query}`);
    const text = await res.text();
    return text.trim() === "VALID";
  } catch (err) {
    console.error("PayFast ITN validation error:", err.message);
    return false;
  }
}

module.exports = {
  PAYFAST_CONFIG,
  PAYFAST_PROCESS_URL,
  PAYFAST_VALIDATE_URL,
  payfastUrlEncode,
  payfastAmount,
  generateSignature,
  verifyPaymentSignature,
  validateItnWithPayfast,
};