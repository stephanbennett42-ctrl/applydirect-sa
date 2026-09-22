/**
 * PayFast Integration Helper (Subscription module)
 * Implements PayFast's Standard Integration (sandbox + live).
 *  - Generates the signed parameter string for the redirect form.
 *  - Verifies the signature returned by PayFast (return URL / ITN).
 *  - Validates an ITN by echoing the received params back to PayFast.
 *
 * Sandbox process URL : https://sandbox.payfast.co.za/eng/process
 * Live process URL    : https://www.payfast.co.za/eng/process
 * Sandbox validate URL: https://sandbox.payfast.co.za/eng/query/validate
 * Live validate URL   : https://www.payfast.co.za/eng/query/validate
 */
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const SANDBOX = process.env.PAYFAST_SANDBOX === 'true'

export const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY,
  passphrase: process.env.PAYFAST_PASSPHRASE || null,
  returnUrl: process.env.PAYFAST_RETURN_URL || 'http://localhost:3004/payment/return',
  cancelUrl: process.env.PAYFAST_CANCEL_URL || 'http://localhost:3004/payment-plan',
  notifyUrl: process.env.PAYFAST_NOTIFY_URL || 'http://localhost:3002/api/payfast/itn'
}

export const PAYFAST_PROCESS_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process'

export const PAYFAST_VALIDATE_URL = SANDBOX
  ? 'https://sandbox.payfast.co.za/eng/query/validate'
  : 'https://www.payfast.co.za/eng/query/validate'

/**
 * PHP-style urlencode: spaces become '+', '~' is left unencoded.
 * Matches the encoding PayFast uses when verifying signatures.
 */
export function payfastUrlEncode(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, '+').replace(/%7E/g, '~')
}

/**
 * Format an amount for PayFast: 2 decimal places, no thousands separator.
 * e.g. 150 -> "150.00"
 */
export function payfastAmount(amount) {
  return Number(amount).toFixed(2)
}

/**
 * Build the PayFast signature (MD5).
 * Fields are sorted by key, url-encoded, joined with '&', then the
 * passphrase is appended if one is configured.
 * @param {object} params — form fields (excluding 'signature')
 * @returns {string} md5 hex signature
 */
export function generateSignature(params) {
  const keys = Object.keys(params).filter(k => params[k] !== undefined && params[k] !== null).sort()
  let str = keys.map(k => `${payfastUrlEncode(k)}=${payfastUrlEncode(params[k])}`).join('&')
  if (PAYFAST_CONFIG.passphrase) {
    str += `&passphrase=${payfastUrlEncode(PAYFAST_CONFIG.passphrase)}`
  }
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * Verify a signature returned by PayFast (return URL query or ITN body).
 * @param {object} params — received params INCLUDING 'signature'
 * @returns {boolean}
 */
export function verifyPaymentSignature(params) {
  const received = params.signature
  if (!received) return false
  const { signature, ...rest } = params
  return received === generateSignature(rest)
}

/**
 * Ask PayFast to validate an ITN. Echo the exact received params back to the
 * validation endpoint (plus passphrase) and check for "VALID".
 * @param {object} params — all params received in the ITN body
 * @returns {Promise<boolean>}
 */
export async function validateItnWithPayfast(params) {
  try {
    const { signature, ...rest } = params
    let query = Object.keys(rest)
      .map(k => `${payfastUrlEncode(k)}=${payfastUrlEncode(rest[k])}`)
      .join('&')
    if (PAYFAST_CONFIG.passphrase) {
      query += `&passphrase=${payfastUrlEncode(PAYFAST_CONFIG.passphrase)}`
    }
    const res = await fetch(`${PAYFAST_VALIDATE_URL}?${query}`)
    const text = await res.text()
    return text.trim() === 'VALID'
  } catch (err) {
    console.error('PayFast ITN validation error:', err.message)
    return false
  }
}