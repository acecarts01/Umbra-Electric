// SMTP sender with a dev-outbox fallback -- missing credentials must never
// block the rest of the module from being built and clicked through.
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { SITE } from '@/config/site';

let cachedTransporter = null;

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!pass || !user) return null;
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST || 'smtp.zoho.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = (process.env.SMTP_SECURE ?? 'true') !== 'false';
  cachedTransporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass }, tls: { rejectUnauthorized: false } });
  return cachedTransporter;
}

export async function sendMail({ to, subject, html, text, replyTo }) {
  const transporter = getTransporter();
  if (!transporter) {
    if (process.env.VERCEL_ENV === 'production') {
      return { sent: false, error: 'SMTP is not configured' };
    }
    // Local dev / Preview without credentials yet: write the exact HTML to
    // disk so the whole flow is buildable and visually testable before SMTP
    // credentials exist. .email-outbox/ is gitignored -- local test output only.
    const file = path.join(process.cwd(), '.email-outbox', `${Date.now()}-${subject.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `<!-- to: ${to} | subject: ${subject} -->\n${html}`);
    return { sent: false, outboxFile: file, error: 'SMTP not configured (dev outbox)' };
  }
  try {
    const info = await transporter.sendMail({
      from: `"${SITE.name}" <${process.env.SMTP_USER}>`,
      to,
      replyTo,
      subject,
      text: text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (e) {
    return { sent: false, error: e.message };
  }
}
