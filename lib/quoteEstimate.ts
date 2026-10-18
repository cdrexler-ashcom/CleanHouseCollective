/**
 * INTERNAL quote estimator - server-side only.
 * --------------------------------------------------------------------------
 * Turns a submitted quote request into a draft price and a ready-to-send
 * reply for the business. It is only imported by app/api/quote/route.ts and
 * its output goes into the business notification email ONLY. Never import
 * this from a client component or show the result to the customer.
 *
 * Source of truth: "UpdatedPricing.xlsx" (Clean House Collective / Pricing).
 * Every price is estimated hours x HOURLY_RATE, which matches the sheet.
 * To change prices, edit HOURLY_RATE or the hours below.
 */

import { site } from "@/data/site";

export const HOURLY_RATE = 80;

/** Matches the "$20 off your first Refresh" offer advertised on the site. */
export const NEW_CLIENT_DISCOUNT = 20;

type Item = { label: string; hours: number; perQty?: boolean };

const ITEMS = {
  base1Bath: { label: "Standard clean: 1 bathroom, up to 4 bedrooms", hours: 2 },
  base2Bath: { label: "Standard clean: 2 bathrooms, up to 4 bedrooms", hours: 2.5 },
  base25Bath: { label: "Standard clean: 2.5 bathrooms, up to 4 bedrooms", hours: 3 },
  extraBedroom: { label: "Extra bedroom", hours: 0.5, perQty: true },
  extraBathroom: { label: "Extra bathroom", hours: 0.5, perQty: true },
  deepBathroom: { label: "Deep clean bathroom", hours: 1.5, perQty: true },
  deepKitchen: { label: "Deep clean kitchen", hours: 3 },
  windows: { label: "Windows", hours: 3 },
  deepBedroom: { label: "Deep clean bedroom", hours: 2, perQty: true },
  oven: { label: "Oven cleaning", hours: 1.5, perQty: true },
  gasStove: { label: "Deep clean gas stove", hours: 1 },
  walls: { label: "Deep clean walls", hours: 4 },
  fridge: { label: "Fridge interior", hours: 1 },
  cupboards: { label: "Kitchen cupboards interior", hours: 2 },
  office: { label: "Office / business environment cleaning", hours: 2 },
} satisfies Record<string, Item>;

type ItemKey = keyof typeof ITEMS;

const price = (key: ItemKey, qty = 1) => ITEMS[key].hours * HOURLY_RATE * qty;

/** Website "Optional extras" (data/site.ts) -> pricing item. */
const EXTRA_MAP: Record<string, ItemKey> = {
  "Oven refresh": "oven",
  "Gas stove deep clean": "gasStove",
  "Fridge interior": "fridge",
  "Interior windows": "windows",
  "Inside cupboards": "cupboards",
  "Extra bathrooms": "extraBathroom",
  "Additional rooms": "extraBedroom",
  "Wall cleaning": "walls",
};

export type QuoteInput = {
  service: string;
  frequency: string;
  bedrooms: string;
  bathrooms: string;
  extras: string;
  suburb: string;
  notes: string;
  name: string;
};

export type QuoteLine = { label: string; amount: number };

export type QuoteEstimate = {
  isOffice: boolean;
  lines: QuoteLine[];
  total: number;
  hours: number;
  /** True when the deep-clean price list is useful (Deep Refresh / unsure). */
  showDeepReference: boolean;
  /** Things the business should double check before sending. */
  flags: string[];
  /** Subject + body of the reply, ready to copy and paste. */
  reply: string;
};

export function isOfficeService(service: string): boolean {
  return /office|business/i.test(service);
}

export function estimateQuote(
  data: QuoteInput,
  photoCount: number
): QuoteEstimate {
  const lines: QuoteLine[] = [];
  const flags: string[] = [];
  let hours = 0;

  const add = (key: ItemKey, qty = 1, label?: string) => {
    lines.push({
      label: label ?? (qty > 1 ? `${ITEMS[key].label} x${qty}` : ITEMS[key].label),
      amount: price(key, qty),
    });
    hours += ITEMS[key].hours * qty;
  };

  const isOffice = isOfficeService(data.service);
  const showDeepReference = !isOffice && /deep|not sure/i.test(data.service);

  if (isOffice) {
    add("office");
    flags.push(
      "Office clean is priced as the flat 2-hour rate. Confirm the size of the space and the scope (floors, kitchenette, bathrooms, bins) from the notes or photos."
    );
  } else {
    addBase(data, add, flags);
    addExtras(data, add, flags);

    if (/deep/i.test(data.service)) {
      flags.push(
        "Deep Refresh is individually quoted. This total is the standard clean plus any extras chosen. Add the deep-clean items below as needed."
      );
    } else if (/not sure/i.test(data.service)) {
      flags.push(
        "Customer was not sure which service they want. Priced as a standard clean, confirm the right service with them."
      );
    }
  }

  lines.push({ label: "New client offer (first clean)", amount: -NEW_CLIENT_DISCOUNT });
  flags.push(
    `Includes the $${NEW_CLIENT_DISCOUNT} new client offer. Remove that line if they are an existing client.`
  );

  if (photoCount === 0 && !isOffice) {
    flags.push("No photos were attached, so condition and layout are unconfirmed.");
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  const estimate = { isOffice, lines, total, hours, flags, showDeepReference };
  return { ...estimate, reply: buildReply(data, estimate, photoCount) };
}

// ---------------------------------------------------------------------------
// Pricing rules
// ---------------------------------------------------------------------------

type Add = (key: ItemKey, qty?: number, label?: string) => void;

function addBase(data: QuoteInput, add: Add, flags: string[]) {
  const baths = parseBathrooms(data.bathrooms);
  const beds = parseBedrooms(data.bedrooms);

  if (!baths) {
    add("base1Bath");
    flags.push("Bathroom count was missing or unclear. Priced as 1 bathroom.");
  } else if (baths.full >= 3) {
    // The sheet's largest tier is 2.5 bathrooms; each bathroom beyond that is
    // an "Extra Bathroom" ($40). A half bath above that counts as one more.
    add("base25Bath");
    add("extraBathroom", baths.full - 2 + (baths.half ? 1 : 0));
    flags.push(
      `${data.bathrooms} bathrooms is above the largest tier, priced as the 2.5 bathroom tier plus extra bathrooms. Confirm.`
    );
    if (baths.plus) flags.push("Customer chose 4+ bathrooms, priced as 4. Confirm the actual number.");
  } else if (baths.full === 2) {
    add(baths.half ? "base25Bath" : "base2Bath");
  } else {
    // 1 bathroom, or 1 + half bath. The sheet has no 1.5 tier, so a half bath
    // moves the home up to the 2 bathroom tier.
    add(baths.half ? "base2Bath" : "base1Bath");
    if (baths.half) {
      flags.push("1 + half bath is priced as the 2 bathroom tier (no 1.5 tier in the price sheet). Confirm.");
    }
  }

  if (beds && beds.count > 4) {
    add("extraBedroom", beds.count - 4);
    if (beds.plus) {
      flags.push("Customer chose 5+ bedrooms, priced as 5. Confirm the actual number.");
    }
  } else if (!beds) {
    flags.push("Bedroom count was missing or unclear. Priced as up to 4 bedrooms.");
  }
}

function addExtras(data: QuoteInput, add: Add, flags: string[]) {
  const chosen = data.extras
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && s.toLowerCase() !== "none");

  for (const name of chosen) {
    const key = EXTRA_MAP[name];
    if (!key) {
      flags.push(`"${name}" has no price in the sheet. Price it manually.`);
      continue;
    }
    add(key);
    if ("perQty" in ITEMS[key] && ITEMS[key].perQty) {
      flags.push(`${name}: priced as 1. Confirm the quantity (check notes).`);
    }
  }
}

function parseBathrooms(v: string) {
  const m = v.match(/(\d+)/);
  if (!m) return null;
  return {
    full: Number(m[1]),
    half: /half/i.test(v),
    plus: v.includes("+") && !/half/i.test(v),
  };
}

function parseBedrooms(v: string) {
  const m = v.match(/(\d+)/);
  if (!m) return null;
  return { count: Number(m[1]), plus: v.includes("+") };
}

// ---------------------------------------------------------------------------
// Reply template
// ---------------------------------------------------------------------------

export const money = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-AU")}`;

function buildReply(
  data: QuoteInput,
  est: Pick<QuoteEstimate, "isOffice" | "lines" | "total">,
  photoCount: number
): string {
  const b = site.booking;
  const firstName = data.name.split(/\s+/)[0] || "there";
  const TOTAL_LABEL = "Total for your first clean";
  const recurring = Boolean(data.frequency) && !/one-off/i.test(data.frequency);
  const width = Math.max(TOTAL_LABEL.length, ...est.lines.map((l) => l.label.length));
  const lineRows = est.lines
    .map((l) => `  ${l.label.padEnd(width)}   ${money(l.amount)}`)
    .join("\n");

  const what = est.isOffice
    ? "office cleaning"
    : data.service.replace(/\s*\(.*\)/, "").toLowerCase() || "cleaning";
  const freq =
    data.frequency && !/one-off/i.test(data.frequency)
      ? ` on a ${data.frequency.toLowerCase()} basis`
      : "";
  const place = data.suburb ? ` in ${data.suburb}` : "";

  return (
    `Subject: Your Clean House Collective quote\n\n` +
    `Hi ${firstName},\n\n` +
    `Thanks for getting in touch with Clean House Collective! Based on the details you sent through, here's your flat-rate quote for ${what}${freq}${place}:\n\n` +
    `${lineRows}\n` +
    `  ${"-".repeat(width + 3 + 6)}\n` +
    `  ${TOTAL_LABEL.padEnd(width)}   ${money(est.total)}\n` +
    (recurring
      ? `  ${"Each clean after that".padEnd(width)}   ${money(est.total + NEW_CLIENT_DISCOUNT)}\n\n`
      : `\n`) +
    `This is a flat rate for the service, not the clock. It includes fuel, insurance, professional equipment, cleaning products and labour, so there's nothing for you to supply.\n\n` +
    (photoCount === 0 && !est.isOffice
      ? `If you can, please send through a few current photos of the kitchen and bathroom/s (no need to tidy up!) so we can confirm the price with no surprises on the day.\n\n`
      : "") +
    `To lock in your booking, a ${b.deposit} deposit secures your spot:\n` +
    `  Account name: ${b.bank.accountName}\n` +
    `  BSB: ${b.bank.bsb}\n` +
    `  Account number: ${b.bank.accountNumber}\n` +
    `  Reference: ${b.bank.reference}\n\n` +
    `Let us know your preferred day and time and we'll get you booked in. Any questions, just reply to this email or call us on ${site.contact.phone}.\n\n` +
    `Warm regards,\n` +
    `Clean House Collective\n` +
    `${site.tagline}\n` +
    `ABN ${site.abn}\n`
  );
}

/** Deep-clean items for manual add-on when a Deep Refresh is quoted. */
export function deepCleanReference(): { label: string; price: number }[] {
  const keys: ItemKey[] = [
    "deepKitchen",
    "deepBathroom",
    "deepBedroom",
    "walls",
    "windows",
    "oven",
  ];
  return keys.map((k) => ({
    label: ITEMS[k].label + ("perQty" in ITEMS[k] && ITEMS[k].perQty ? " (each)" : ""),
    price: price(k),
  }));
}
