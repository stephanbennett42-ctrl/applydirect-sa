/**
 * Notification Service
 * Sends acceptance emails and WhatsApp messages when a student is approved.
 *
 * Email uses Nodemailer + SMTP (configure SMTP_* env vars to enable).
 * WhatsApp uses the Twilio WhatsApp API via fetch (configure TWILIO_* env vars to enable).
 *
 * When the credentials are not configured, the service runs in "sandbox mode":
 * it logs what would have been sent to the console and notification-log.txt
 * so the app never fails.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOG_FILE = path.join(__dirname, 'notification-log.txt')

const emailConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

const whatsappConfigured = () =>
  !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM)

function log(entry) {
  const line = `[${new Date().toISOString()}] ${entry}\n`
  console.log('[notification]', entry)
  try {
    fs.appendFileSync(LOG_FILE, line)
  } catch (err) {
    // logging must never break the app
  }
}

/**
 * Send an HTML email.
 * Returns { delivered, channel, sandbox?, error? }. Never throws.
 */
async function sendEmail({ to, subject, html } = {}) {
  if (!emailConfigured()) {
    log(`[email sandbox] Would send to "${to}" — subject: "${subject}"`)
    return { delivered: false, channel: 'email', sandbox: true }
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html
    })
    log(`[email delivered] "${to}" — subject: "${subject}"`)
    return { delivered: true, channel: 'email' }
  } catch (err) {
    log(`[email FAILED] "${to}" — ${err.message}`)
    return { delivered: false, channel: 'email', error: err.message }
  }
}

/**
 * Build a free wa.me deep link (no API account needed).
 * Opens WhatsApp on the recipient's phone with the message pre-filled.
 * South African local numbers (067 802 0783) are converted to +27 format.
 */
export function buildWhatsAppLink(to, message) {
  let digits = String(to || '').replace(/[^\d+]/g, '')
  digits = digits.replace(/^\+/, '')
  if (/^0\d{9}$/.test(digits)) {
    digits = '27' + digits.slice(1)
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/**
 * Send a WhatsApp message via Twilio.
 * Returns { delivered, channel, sandbox?, waLink?, error? }. Never throws.
 */
async function sendWhatsApp({ to, message } = {}) {
  if (!whatsappConfigured()) {
    const waLink = buildWhatsAppLink(to, message)
    log(`[whatsapp sandbox] Would send to "${to}" — ready-to-send link: ${waLink}`)
    return { delivered: false, channel: 'whatsapp', sandbox: true, waLink }
  }
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID
    const auth = 'Basic ' + Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: auth
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_WHATSAPP_FROM,
        To: `whatsapp:${to.replace(/[^+\d]/g, '')}`,
        Body: message
      })
    })
    if (res.ok) {
      log(`[whatsapp delivered] "${to}"`)
      return { delivered: true, channel: 'whatsapp' }
    }
    const body = await res.text()
    log(`[whatsapp FAILED] "${to}" — ${body}`)
    return { delivered: false, channel: 'whatsapp', error: body }
  } catch (err) {
    log(`[whatsapp FAILED] "${to}" — ${err.message}`)
    return { delivered: false, channel: 'whatsapp', error: err.message }
  }
}

/**
 * Send the "you have been accepted" notification to a user.
 * Uses the user record: first_name, last_name, email, phone.
 * Returns an array of per-channel results.
 */
export async function sendAcceptanceNotification(user) {
  const firstName = user.first_name || user.firstName || 'Student'
  const lastName = user.last_name || user.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()

  const subject = 'Your UniApply application has been ACCEPTED'
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#000A52;color:#fff;padding:24px 32px;">
        <h2 style="margin:0;">UniApply</h2>
      </div>
      <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;">
        <p>Dear ${fullName},</p>
        <p>Congratulations! Your application has been <strong>ACCEPTED</strong>. We are delighted to welcome you to the UniApply family.</p>
        <p>One of our advisors will contact you shortly with your next steps, including document submissions and university placement details.</p>
        <p style="margin-top:32px;">Warm regards,<br/>The UniApply Team<br/>Cape Town, South Africa</p>
      </div>
    </div>
  `
  const whatsappMessage =
    `Congratulations, ${firstName}! Your UniApply application has been ACCEPTED. ` +
    'One of our advisors will contact you shortly with your next steps. Welcome to the family!'

  const results = []
  if (user.email) {
    results.push(await sendEmail({ to: user.email, subject, html }))
  }
  if (user.phone) {
    results.push(await sendWhatsApp({ to: user.phone, message: whatsappMessage }))
  }
  return results
}