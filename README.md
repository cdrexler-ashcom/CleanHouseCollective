# Clean House Collective — Website

A modern marketing & lead-generation website for **Clean House Collective**, a
domestic cleaning business based in **Kallangur**, servicing **North Brisbane &
Moreton Bay** within roughly a 30 km radius.

Built with **Next.js 14 (App Router)**, **TypeScript** and **Tailwind CSS**.

> **Tagline:** _Come home to fresh, without the fuss._

---

## ✨ Features

- **Fully responsive**, mobile-first design with a hamburger menu
- **Dark / light mode** with system-preference detection (no flash on load)
- **Real business content** — services, flat-rate pricing, service area, FAQs
- **18 five-star client reviews** (from Airtasker)
- **Multi-step quote questionnaire** — the primary lead-conversion feature
- **📷 Photo upload _and_ live camera capture** in the quote form (optional now,
  ready to make mandatory later)
- **Real email delivery** — quote requests (with photo attachments) are emailed
  to the business inbox via a serverless API route
- **SEO foundations** — metadata, Open Graph tags, semantic HTML
- **Content-driven** — nearly all copy lives in one file (`data/site.ts`)

---

## 🚀 Getting Started

Requires **Node.js 18.17+**.

```bash
npm install
npm run dev      # → http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

---

## 📷 Photo upload & camera capture

The quote questionnaire includes a **Photos** step (`components/PhotoStep.tsx`)
that lets clients:

1. **Upload** existing images from their device, and/or
2. **Use camera** — capture a photo live from the website. On mobile this opens
   the rear camera; on desktop it uses the webcam (via the `getUserMedia` API).

Photos are optional for now. To make them **mandatory** later, open
`components/QuoteModal.tsx` and change the `canContinue` check for the `photos`
step so it requires `photos.length > 0`.

Limits (count and file size) are configured in `data/site.ts` under
`photoLimits`.

> **Note:** Camera capture requires **HTTPS** (or `localhost`). Browsers block
> camera access on plain `http://` origins. Vercel/Netlify serve HTTPS by
> default, so this works automatically in production.

---

## ✉️ Sending emails to the business inbox

Quote requests are emailed to **cleanhousecollective@outlook.com**. Because the
form can include **photo attachments**, this needs a small server-side step
(a plain `mailto:` link can't attach files). Three options, simplest first:

### Option A — Serverless API route + SMTP (included, recommended)

This project ships with a working endpoint at **`app/api/quote/route.ts`** that
uses [Nodemailer](https://nodemailer.com) to send the email with attachments.

1. Copy the env template and fill in real values:
   ```bash
   cp .env.example .env.local
   ```
2. For the Outlook inbox, use Outlook's SMTP server and an **app password**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=cleanhousecollective@outlook.com
   SMTP_PASS=your-16-char-app-password
   QUOTE_TO=cleanhousecollective@outlook.com
   QUOTE_FROM=cleanhousecollective@outlook.com
   ```
   > Generate an app password at **account.microsoft.com → Security → Advanced
   > security options → App passwords**. This requires two-step verification to
   > be enabled. Never use the normal account password, and never commit
   > `.env.local`.
3. Run `npm run dev` and submit a test quote. The email (with any photos
   attached) lands in the Outlook inbox. Replies go straight to the customer
   (the customer's email is set as `Reply-To`).

**Deploying to Vercel:** add the same variables under **Project → Settings →
Environment Variables**, then redeploy. No other change needed.

> ⚠️ Microsoft is progressively retiring Basic Auth SMTP on some tenants. If
> Outlook SMTP is blocked on the account, use Option B or C below — the
> front-end code doesn't change, only the contents of `route.ts`.

### Option B — Transactional email service (most reliable at scale)

Swap the Nodemailer transport in `route.ts` for a provider like
**[Resend](https://resend.com)**, **SendGrid**, or **Mailgun**. These deliver
reliably from cloud hosts and support attachments. Example with Resend:

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "quotes@yourdomain.com.au",       // a verified domain you own
  to: "cleanhousecollective@outlook.com", // delivered to the Outlook inbox
  replyTo: data.email,
  subject: `New Quote Request — ${data.service}`,
  html,
  attachments: attachments.map(a => ({ filename: a.filename, content: a.content })),
});
```

### Option C — Zero-backend form service

If you'd rather keep the site fully static (no API route/server), use a hosted
form endpoint such as **[Web3Forms](https://web3forms.com)** (free) or
**Formspree**. They accept `multipart/form-data` (including file attachments)
and forward it to any inbox. In `QuoteModal.tsx`, change the `fetch("/api/quote")`
URL to the provider's endpoint and add your access key. You can then re-enable
`output: "export"` in `next.config.mjs` for a static build.

---

## 🛠️ Customising content

Almost everything lives in **`data/site.ts`**:

| What                     | Where               |
| ------------------------ | ------------------- |
| Business name / tagline  | `site`              |
| Phone & email            | `site.contact`      |
| New-client / referral    | `site.offers`       |
| Services & descriptions  | `services[]`        |
| Flat-rate pricing tiers  | `pricing[]`         |
| What's included / extras | `standardInclusions`, `optionalExtras` |
| Suburbs serviced         | `serviceAreas[]`    |
| Reviews                  | `testimonials[]`    |
| FAQs                     | `faqs[]`            |
| Quote questionnaire      | `quoteSteps[]`      |
| Photo limits             | `photoLimits`       |

> **Before launch:** replace the placeholder **phone number** in
> `site.contact.phone` with the real one.

### Branding

Brand colours (matching the logo) live in `tailwind.config.ts`:
Emerald `#0D4F45`, Sage `#86A88A`, Cream `#FAFAF7`, Charcoal `#1E1E1E`.
The logo is at `public/logo.png`.

---

## 📁 Project structure

```
clean-house-collective/
├── app/
│   ├── api/quote/route.ts   # ✉️ Email endpoint (Nodemailer + attachments)
│   ├── layout.tsx           # Fonts, metadata, theme script
│   ├── page.tsx             # Home page — assembles all sections
│   └── globals.css
├── components/
│   ├── Navbar, Hero, About, Services, Pricing, ServiceArea,
│   │   Testimonials, FAQ, Contact, Footer
│   ├── QuoteModal.tsx        # Multi-step questionnaire
│   ├── PhotoStep.tsx         # 📷 Upload + live camera capture
│   ├── QuoteProvider.tsx     # Context so any CTA opens the modal
│   ├── ThemeToggle, Logo, Icon
├── data/site.ts              # 🔑 Single source of truth for content
├── public/logo.png           # Brand logo
├── .env.example              # Email/SMTP configuration template
└── ...config files
```

---

## 🔮 Future phases

- Make photos mandatory on the quote form
- Online booking calendar & automated scheduling
- CRM integration
- Automated flat-rate quote estimation
- Google Reviews integration
- Before-and-after galleries

---

Made for Clean House Collective · _Come home to fresh, without the fuss._
