/* Serverless handler for the contact form (Vercel).
   
      Validates the payload, drops anything that fills the honeypot, then sends
      two mails through nodemailer: a notification to the office and a branded
      auto-reply to the sender.
   
      All credentials come from environment variables set in the Vercel
      dashboard. Never commit real values. */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const RECIPIENT = process.env.CONTACT_TO || "secretary@bicf.ca";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORG = "Black Immigrants Community Foundation";
const ACCENT = "#ff5722";

type Body = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  inquiry?: string;
  message?: string;
  preferredContact?: string;
  consent?: boolean;
  lang?: string;
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

function shell(heading: string, preheader: string, inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f1ee;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f1ee;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="height:4px;background:${ACCENT};line-height:4px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="padding:26px 34px 6px;">
          <div style="font-size:14px;font-weight:800;letter-spacing:3px;color:${ACCENT};">BICF</div>
          <div style="font-size:11px;letter-spacing:0.5px;color:#9b968e;margin-top:2px;">${ORG}</div>
        </td></tr>
        <tr><td style="padding:14px 34px 30px;color:#1c1c1c;font-size:15px;line-height:1.65;">
          <h1 style="margin:0 0 18px;font-size:21px;font-weight:700;color:#141414;">${escapeHtml(heading)}</h1>
          ${inner}
        </td></tr>
        <tr><td style="padding:18px 34px;background:#faf8f5;border-top:1px solid #efece7;color:#96918a;font-size:12px;line-height:1.7;">
          ${ORG}<br/>
          190 Harwood Avenue South, Ajax, Ontario L1S 2H6<br/>
          (905) 931&nbsp;3776 &nbsp;·&nbsp; <a href="mailto:secretary@bicf.ca" style="color:${ACCENT};text-decoration:none;">secretary@bicf.ca</a> &nbsp;·&nbsp; <a href="https://bicf.ca" style="color:${ACCENT};text-decoration:none;">bicf.ca</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function detailRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:9px 18px 9px 0;color:#8f8a82;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:9px 0;color:#1c1c1c;font-size:14px;vertical-align:top;">${valueHtml}</td>
  </tr>`;
}

function quote(text: string): string {
  return `<div style="white-space:pre-wrap;color:#242424;font-size:15px;line-height:1.7;border-left:3px solid ${ACCENT};background:#fbfaf8;padding:12px 18px;border-radius:0 8px 8px 0;">${escapeHtml(text)}</div>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  const body = (req.body ?? {}) as Body;

  if (clip(body.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const firstName = clip(body.firstName, 100);
  const lastName = clip(body.lastName, 100);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 60);
  const subject = clip(body.subject, 200);
  const inquiry = clip(body.inquiry, 60);
  const message = clip(body.message, 5000);
  const lang = body.lang === "fr" ? "fr" : "en";
  const name = `${firstName} ${lastName}`.trim();

  const prefKey = ["email", "phone", "either"].includes(
    clip(body.preferredContact, 20),
  )
    ? clip(body.preferredContact, 20)
    : "either";
  const prefLabelEn =
    prefKey === "email" ? "Email" : prefKey === "phone" ? "Phone" : "Either";

  if (firstName.length < 2)
    return res.status(400).json({ error: "First name is required" });
  if (lastName.length < 2)
    return res.status(400).json({ error: "Last name is required" });
  if (!EMAIL_RE.test(email))
    return res.status(400).json({ error: "A valid email is required" });
  if (prefKey === "phone" && !phone)
    return res
      .status(400)
      .json({ error: "A phone number is required for phone contact" });
  if (subject.length < 2)
    return res.status(400).json({ error: "Subject is required" });
  if (message.length < 10)
    return res
      .status(400)
      .json({ error: "Message must be at least 10 characters" });
  if (body.consent !== true)
    return res.status(400).json({ error: "Consent is required" });

  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
  });

  const notifInner = `
    <p style="margin:0 0 20px;color:#565049;">You've received a new message through the bicf.ca contact form.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      ${detailRow("Name", escapeHtml(name))}
      ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(email)}</a>`)}
      ${detailRow("Phone", phone ? `<a href="tel:${escapeHtml(phone)}" style="color:#1c1c1c;text-decoration:none;">${escapeHtml(phone)}</a>` : "&mdash;")}
      ${detailRow("Prefers", escapeHtml(prefLabelEn))}
      ${detailRow("Inquiry", inquiry ? escapeHtml(inquiry) : "&mdash;")}
      ${detailRow("Subject", escapeHtml(subject))}
      ${detailRow("Received", escapeHtml(submittedAt))}
    </table>
    <div style="margin:24px 0 10px;color:#8f8a82;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Message</div>
    ${quote(message)}
    <div style="margin-top:28px;">
      <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent("Re: " + subject)}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 26px;border-radius:9px;">Reply to ${escapeHtml(firstName)}</a>
    </div>`;

  const notifText = [
    `New message from the BICF contact form`,
    ``,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Phone:    ${phone || "—"}`,
    `Prefers:  ${prefLabelEn}`,
    `Inquiry:  ${inquiry || "—"}`,
    `Subject:  ${subject}`,
    `Received: ${submittedAt}`,
    ``,
    `Message:`,
    message,
    ``,
    `Reply to: ${email}`,
  ].join("\n");

  const copy =
    lang === "fr"
      ? {
          subject: "Nous avons bien reçu votre message — BICF",
          preheader:
            "Merci de nous avoir écrit. Nous vous répondrons sous un jour ouvrable.",
          heading: "Message bien reçu",
          greeting: `Bonjour ${firstName},`,
          intro: `Merci d'avoir communiqué avec la ${ORG}. Nous avons bien reçu votre message et un membre de notre équipe vous répondra dans un délai d'un jour ouvrable.`,
          urgent:
            "Pour une question urgente liée à une date d'audience, une échéance d'immigration ou une préoccupation de sécurité, veuillez nous appeler au (905) 931 3776.",
          copyLabel: "Voici une copie de votre message :",
          subjectLabel: "Sujet",
          closing: "Cordialement,",
          team: "L'équipe de la BICF",
          note: "Ceci est une confirmation automatique — vous pouvez répondre directement à ce courriel.",
        }
      : {
          subject: "We've received your message — BICF",
          preheader:
            "Thanks for reaching out. We'll get back to you within one business day.",
          heading: "Message received",
          greeting: `Hi ${firstName},`,
          intro: `Thank you for reaching out to the ${ORG}. We've received your message and a member of our team will get back to you within one business day.`,
          urgent:
            "If your matter is urgent — tied to a court date, an immigration deadline, or a safety concern — please call us at (905) 931 3776.",
          copyLabel: "Here's a copy of what you sent:",
          subjectLabel: "Subject",
          closing: "Warm regards,",
          team: "The BICF Team",
          note: "This is an automated confirmation — you can reply directly to this email.",
        };

  const autoInner = `
    <p style="margin:0 0 16px;color:#1c1c1c;">${escapeHtml(copy.greeting)}</p>
    <p style="margin:0 0 18px;color:#454039;">${escapeHtml(copy.intro)}</p>
    <p style="margin:0 0 22px;color:#7a746c;font-size:14px;">${escapeHtml(copy.urgent)}</p>
    <div style="margin:0 0 10px;color:#8f8a82;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(copy.copyLabel)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:12px;">
      ${detailRow(copy.subjectLabel, escapeHtml(subject))}
    </table>
    ${quote(message)}
    <p style="margin:26px 0 0;color:#1c1c1c;">${escapeHtml(copy.closing)}<br/><strong>${escapeHtml(copy.team)}</strong></p>
    <p style="margin:20px 0 0;color:#a29c93;font-size:12px;">${escapeHtml(copy.note)}</p>`;

  const autoText = [
    copy.greeting,
    "",
    copy.intro,
    "",
    copy.urgent,
    "",
    `${copy.copyLabel}`,
    `${copy.subjectLabel}: ${subject}`,
    "",
    message,
    "",
    copy.closing,
    copy.team,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"BICF Contact Form" <${from}>`,
      to: RECIPIENT,
      replyTo: name ? `"${name}" <${email}>` : email,
      subject: `New contact: ${subject} — ${name}`,
      text: notifText,
      html: shell(
        "New contact form submission",
        `New message from ${name}`,
        notifInner,
      ),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("contact notification failed:", msg);
    return res.status(502).json({ error: "Could not send message" });
  }

  try {
    await transporter.sendMail({
      from: `"${ORG}" <${from}>`,
      to: email,
      replyTo: RECIPIENT,
      subject: copy.subject,
      text: autoText,
      html: shell(copy.heading, copy.preheader, autoInner),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("contact auto-reply failed:", msg);
  }

  return res.status(200).json({ ok: true });
}
