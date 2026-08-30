import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Quote request email endpoint.
 * --------------------------------------------------------------------------
 * Receives the quote questionnaire (as multipart/form-data, including any
 * photos the client uploaded or captured) and emails it to the business
 * inbox — attachments included.
 *
 * This route runs on the Node.js runtime (required for nodemailer + file
 * buffers). Configure the SMTP credentials via environment variables — never
 * hard-code them. See `.env.example` and the README for setup.
 *
 * Recommended for the Outlook inbox (cleanhousecollective@outlook.com):
 *   SMTP_HOST=smtp-mail.outlook.com
 *   SMTP_PORT=587
 *   SMTP_USER=cleanhousecollective@outlook.com
 *   SMTP_PASS=<an app password generated in the Microsoft account security page>
 *   QUOTE_TO=cleanhousecollective@outlook.com
 *   QUOTE_FROM=cleanhousecollective@outlook.com
 */

export const runtime = "nodejs";

const MAX_FILES = 6;
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB per file

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const get = (k: string) => (form.get(k)?.toString() || "").trim();

    const data = {
      service: get("service"),
      frequency: get("frequency"),
      bedrooms: get("bedrooms"),
      bathrooms: get("bathrooms"),
      extras: get("extras"),
      suburb: get("suburb"),
      notes: get("notes"),
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
    };

    // Basic validation.
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Name, email and phone are required." },
        { status: 400 }
      );
    }

    // Collect photo attachments (optional).
    const files = form.getAll("photos").filter((f): f is File => f instanceof File);
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many photos (max ${MAX_FILES}).` },
        { status: 400 }
      );
    }

    const attachments: {
      filename: string;
      content: Buffer;
      contentType: string;
    }[] = [];
    for (const file of files) {
      if (file.size === 0) continue;
      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Each photo must be under 8 MB.` },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name || `photo-${attachments.length + 1}.jpg`,
        content: buffer,
        contentType: file.type || "image/jpeg",
      });
    }

    // Build the transport from environment variables.
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      // Fail loudly in the server logs, but return a clear client message so the
      // front-end can fall back to mailto.
      console.error(
        "[quote] SMTP env vars missing. Set SMTP_HOST, SMTP_USER and SMTP_PASS."
      );
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587 (STARTTLS)
      auth: { user, pass },
    });

    const to = process.env.QUOTE_TO || "cleanhousecollective@outlook.com";
    const from = process.env.QUOTE_FROM || user;

    const summaryLines = [
      ["Service", data.service],
      ["Frequency", data.frequency],
      ["Bedrooms", data.bedrooms],
      ["Bathrooms", data.bathrooms],
      ["Optional extras", data.extras],
      ["Suburb", data.suburb],
      ["Notes", data.notes],
    ]
      .map(([label, value]) => `${label}: ${value || "—"}`)
      .join("\n");

    const text =
      `New quote request from the Clean House Collective website\n` +
      `========================================================\n\n` +
      `${summaryLines}\n\n` +
      `--- Contact ---\n` +
      `Name:  ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone}\n\n` +
      `Photos attached: ${attachments.length}\n`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#1E1E1E;max-width:560px">
        <h2 style="color:#0D4F45;margin:0 0 4px">New Quote Request</h2>
        <p style="margin:0 0 16px;color:#6B8C6F">Clean House Collective website</p>
        <table style="border-collapse:collapse;width:100%">
          ${[
            ["Service", data.service],
            ["Frequency", data.frequency],
            ["Bedrooms", data.bedrooms],
            ["Bathrooms", data.bathrooms],
            ["Optional extras", data.extras],
            ["Suburb", data.suburb],
            ["Notes", data.notes],
          ]
            .map(
              ([label, value]) =>
                `<tr>
                   <td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:bold;width:150px">${label}</td>
                   <td style="padding:6px 12px;border-bottom:1px solid #eee">${
                     value ? escapeHtml(value) : "—"
                   }</td>
                 </tr>`
            )
            .join("")}
        </table>
        <h3 style="color:#0D4F45;margin:20px 0 8px">Contact</h3>
        <p style="margin:0;line-height:1.6">
          <strong>${escapeHtml(data.name)}</strong><br/>
          <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a><br/>
          <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>
        </p>
        <p style="margin:16px 0 0;color:#6B8C6F">Photos attached: ${attachments.length}</p>
      </div>
    `;

    await transporter.sendMail({
      to,
      from, // should match the authenticated SMTP account for Outlook
      replyTo: data.email, // so replying goes straight to the customer
      subject: `New Quote Request — ${data.service || "Cleaning"} (${
        data.suburb || "SEQ"
      })`,
      text,
      html,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote] Failed to send:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your request." },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
