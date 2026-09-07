import { NextRequest, NextResponse } from "next/server";
import { site } from "@/data/site";

/**
 * Quote request email endpoint — powered by Resend.
 * --------------------------------------------------------------------------
 * Receives the quote questionnaire (as multipart/form-data, including any
 * photos the client uploaded or captured) and:
 *
 *   1. Emails the business (QUOTE_TO) a full notification — photos attached.
 *   2. Emails the customer a friendly confirmation that includes the $30
 *      booking deposit direct-deposit details.
 *
 * Why Resend? It delivers reliably from serverless hosts (Vercel/Netlify),
 * has a generous free tier, native attachment support, and a dead-simple API.
 * We call its REST endpoint directly with `fetch`, so there's no extra runtime
 * dependency to install.
 *
 * -------------------------- SETUP (one-time) ------------------------------
 * 1. Create a free account at https://resend.com
 * 2. Add & verify your sending domain (e.g. cleanhousecollective.com.au).
 *    For quick testing you can use Resend's shared sender "onboarding@resend.dev".
 * 3. Create an API key, then set these environment variables (see .env.example):
 *      RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
 *      QUOTE_FROM="Clean House Collective <quotes@cleanhousecollective.com.au>"
 *      QUOTE_TO=cleanhousecollective@outlook.com
 * On Vercel, add the same variables under Project → Settings → Environment
 * Variables, then redeploy. Nothing else to change.
 */

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_FILES = 6;
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB per file

type ResendAttachment = { filename: string; content: string };

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
    if (!isEmail(data.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Collect photo attachments (optional), encoded as base64 for Resend.
    const files = form
      .getAll("photos")
      .filter((f): f is File => f instanceof File);
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many photos (max ${MAX_FILES}).` },
        { status: 400 }
      );
    }

    const attachments: ResendAttachment[] = [];
    for (const file of files) {
      if (file.size === 0) continue;
      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Each photo must be under 8 MB." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name || `photo-${attachments.length + 1}.jpg`,
        content: buffer.toString("base64"),
      });
    }

    // Read config.
    const apiKey = process.env.RESEND_API_KEY;
    const from =
      process.env.QUOTE_FROM ||
      "Clean House Collective <onboarding@resend.dev>";
    const to = process.env.QUOTE_TO || site.contact.email;

    if (!apiKey) {
      console.error(
        "[quote] RESEND_API_KEY missing. Set it in your environment (see .env.example)."
      );
      // 503 lets the front-end fall back to a mailto link.
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 503 }
      );
    }

    // 1) Notify the business (with photos attached).
    const businessRes = await sendEmail(apiKey, {
      from,
      to: [to],
      reply_to: data.email, // replying goes straight to the customer
      subject: `New Quote Request — ${data.service || "Cleaning"} (${
        data.suburb || "SEQ"
      })`,
      text: businessText(data, attachments.length),
      html: businessHtml(data, attachments.length),
      attachments,
    });

    if (!businessRes.ok) {
      const detail = await safeText(businessRes);
      console.error("[quote] Business email failed:", businessRes.status, detail);
      return NextResponse.json(
        { error: "Something went wrong sending your request." },
        { status: 502 }
      );
    }

    // 2) Send the customer a confirmation with the deposit details.
    //    Non-fatal: if this fails we still consider the submission successful,
    //    because the business has already been notified.
    try {
      await sendEmail(apiKey, {
        from,
        to: [data.email],
        reply_to: to,
        subject: "We've received your quote request — Clean House Collective",
        text: customerText(data),
        html: customerHtml(data),
      });
    } catch (err) {
      console.error("[quote] Customer confirmation failed (non-fatal):", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quote] Failed to send:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your request." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Resend helper
// ---------------------------------------------------------------------------

async function sendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string[];
    reply_to?: string;
    subject: string;
    text: string;
    html: string;
    attachments?: ResendAttachment[];
  }
) {
  return fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ---------------------------------------------------------------------------
// Email content
// ---------------------------------------------------------------------------

type QuoteData = {
  service: string;
  frequency: string;
  bedrooms: string;
  bathrooms: string;
  extras: string;
  suburb: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
};

function summaryPairsHtml(rows: [string, string][]): string {
  return rows
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:bold;width:150px">${label}</td>
           <td style="padding:6px 12px;border-bottom:1px solid #eee">${
             value ? escapeHtml(value) : "—"
           }</td>
         </tr>`
    )
    .join("");
}

function businessText(data: QuoteData, photoCount: number): string {
  const rows: [string, string][] = [
    ["Service", data.service],
    ["Frequency", data.frequency],
    ["Bedrooms", data.bedrooms],
    ["Bathrooms", data.bathrooms],
    ["Optional extras", data.extras],
    ["Suburb", data.suburb],
    ["Notes", data.notes],
  ];
  return (
    `New quote request from the Clean House Collective website\n` +
    `========================================================\n\n` +
    rows.map(([l, v]) => `${l}: ${v || "—"}`).join("\n") +
    `\n\n--- Contact ---\n` +
    `Name:  ${data.name}\n` +
    `Email: ${data.email}\n` +
    `Phone: ${data.phone}\n\n` +
    `Photos attached: ${photoCount}\n`
  );
}

function businessHtml(data: QuoteData, photoCount: number): string {
  const rows: [string, string][] = [
    ["Service", data.service],
    ["Frequency", data.frequency],
    ["Bedrooms", data.bedrooms],
    ["Bathrooms", data.bathrooms],
    ["Optional extras", data.extras],
    ["Suburb", data.suburb],
    ["Notes", data.notes],
  ];
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1E1E1E;max-width:560px">
      <h2 style="color:#0D4F45;margin:0 0 4px">New Quote Request</h2>
      <p style="margin:0 0 16px;color:#6B8C6F">Clean House Collective website</p>
      <table style="border-collapse:collapse;width:100%">
        ${summaryPairsHtml(rows)}
      </table>
      <h3 style="color:#0D4F45;margin:20px 0 8px">Contact</h3>
      <p style="margin:0;line-height:1.6">
        <strong>${escapeHtml(data.name)}</strong><br/>
        <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a><br/>
        <a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>
      </p>
      <p style="margin:16px 0 0;color:#6B8C6F">Photos attached: ${photoCount}</p>
    </div>
  `;
}

function customerText(data: QuoteData): string {
  const b = site.booking;
  return (
    `Hi ${data.name},\n\n` +
    `Thanks for reaching out to Clean House Collective — we've received your ` +
    `quote request and we'll be in touch soon with your personalised flat-rate quote.\n\n` +
    `Here's a summary of what you sent us:\n` +
    `- Service: ${data.service || "—"}\n` +
    `- Frequency: ${data.frequency || "—"}\n` +
    `- Bedrooms: ${data.bedrooms || "—"}\n` +
    `- Bathrooms: ${data.bathrooms || "—"}\n` +
    `- Optional extras: ${data.extras || "—"}\n` +
    `- Suburb: ${data.suburb || "—"}\n` +
    (data.notes ? `- Notes: ${data.notes}\n` : "") +
    `\nSecuring your booking\n` +
    `---------------------\n` +
    `${b.depositBlurb}\n\n` +
    `Direct deposit details:\n` +
    `  Account name: ${b.bank.accountName}\n` +
    `  BSB: ${b.bank.bsb}\n` +
    `  Account number: ${b.bank.accountNumber}\n` +
    `  Reference: ${b.bank.reference}\n\n` +
    `Please wait until we've confirmed your quote before transferring your ` +
    `${b.deposit} deposit. New clients also receive ${site.offers.newClient}!\n\n` +
    `Questions? Just reply to this email or call us on ${site.contact.phone}.\n\n` +
    `Warm regards,\n` +
    `Clean House Collective\n` +
    `${site.tagline}\n` +
    `ABN ${site.abn}\n`
  );
}

function customerHtml(data: QuoteData): string {
  const b = site.booking;
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1E1E1E;max-width:560px;line-height:1.6">
      <h2 style="color:#0D4F45;margin:0 0 8px">Thanks, ${escapeHtml(
        data.name
      )}! 🌿</h2>
      <p style="margin:0 0 16px">
        We've received your quote request and we'll be in touch soon with your
        personalised flat-rate quote.
      </p>

      <h3 style="color:#0D4F45;margin:20px 0 6px">Your request</h3>
      <table style="border-collapse:collapse;width:100%">
        ${summaryPairsHtml([
          ["Service", data.service],
          ["Frequency", data.frequency],
          ["Bedrooms", data.bedrooms],
          ["Bathrooms", data.bathrooms],
          ["Optional extras", data.extras],
          ["Suburb", data.suburb],
          ["Notes", data.notes],
        ])}
      </table>

      <h3 style="color:#0D4F45;margin:24px 0 6px">Securing your booking</h3>
      <p style="margin:0 0 12px">${escapeHtml(b.depositBlurb)}</p>
      <table style="border-collapse:collapse;width:100%;background:#FAFAF7;border-radius:8px">
        ${summaryPairsHtml([
          ["Deposit", `${b.deposit} (direct deposit)`],
          ["Account name", b.bank.accountName],
          ["BSB", b.bank.bsb],
          ["Account number", b.bank.accountNumber],
          ["Reference", b.bank.reference],
        ])}
      </table>
      <p style="margin:12px 0 0;color:#6B8C6F">
        Please wait until we've confirmed your quote before transferring your
        ${escapeHtml(b.deposit)} deposit. New clients also receive
        ${escapeHtml(site.offers.newClient)}!
      </p>

      <p style="margin:20px 0 0">
        Questions? Just reply to this email or call us on
        <a href="${site.contact.phoneHref}">${escapeHtml(site.contact.phone)}</a>.
      </p>

      <p style="margin:20px 0 0;color:#6B8C6F">
        Warm regards,<br/>
        <strong>Clean House Collective</strong><br/>
        ${escapeHtml(site.tagline)}<br/>
        ABN ${escapeHtml(site.abn)}
      </p>
    </div>
  `;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
