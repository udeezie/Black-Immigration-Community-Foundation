import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const RECIPIENT =
  process.env.CONTACT_TO || "info@blackimmigrantscommunityfoundation.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  inquiry?: string;
  message?: string;
  website?: string;
};

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const from = process.env.CONTACT_FROM || user;
  if (!host || !user || !pass) {
    console.error(
      "SMTP configuration is incomplete (need SMTP_HOST, SMTP_USER, SMTP_PASS)",
    );
    return res
      .status(500)
      .json({ error: "Email service is not configured" });
  }

  // STARTTLS on 587 (secure=false), implicit TLS on 465 (secure=true).
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  const body = (req.body ?? {}) as Body;

  if (clip(body.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const name = clip(body.name, 200);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 60);
  const subject = clip(body.subject, 200);
  const inquiry = clip(body.inquiry, 60);
  const message = clip(body.message, 5000);

  if (name.length < 2)
    return res.status(400).json({ error: "Name is required" });
  if (!EMAIL_RE.test(email))
    return res.status(400).json({ error: "A valid email is required" });
  if (subject.length < 2)
    return res.status(400).json({ error: "Subject is required" });
  if (message.length < 10)
    return res
      .status(400)
      .json({ error: "Message must be at least 10 characters" });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
  });

  const html = `
    <div style="font-family:-apple-system,system-ui,Segoe UI,Roboto,sans-serif;color:#111;line-height:1.5;">
      <h2 style="margin:0 0 16px;font-size:18px;">New message from the BICF contact form</h2>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 16px 4px 0;color:#666;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666;">Phone</td><td>${escapeHtml(phone) || "&mdash;"}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666;">Inquiry</td><td>${escapeHtml(inquiry) || "&mdash;"}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#666;">Subject</td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
      <p style="white-space:pre-wrap;font-size:14px;">${escapeHtml(message)}</p>
    </div>
  `;

  const text = [
    "New message from the BICF contact form",
    "",
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "—"}`,
    `Inquiry: ${inquiry || "—"}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"BICF Contact Form" <${from}>`,
      to: RECIPIENT,
      replyTo: email,
      subject: `[BICF] ${subject}`,
      text,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("contact send failed:", msg);
    return res.status(502).json({ error: "Could not send message" });
  }
}
