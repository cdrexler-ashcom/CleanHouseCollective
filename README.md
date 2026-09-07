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
- **Real email delivery (Resend)** — quote requests (with photo attachments) are
  emailed to the business, and the customer gets an automatic confirmation
- **💳 $30 booking deposit** — direct-deposit details are emailed to the customer
  on submission and shown on the confirmation screen
- **Business details** — phone `0499 930 422` and ABN `48 701 813 578` shown
  where relevant
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

## ✉️ Sending emails to the business inbox (Resend)

Quote requests are emailed to **cleanhousecollective@outlook.com**. Because the
form can include **photo attachments** and also sends the customer a
confirmation, this uses a small serverless endpoint at **`app/api/quote/route.ts`**
powered by [**Resend**](https://resend.com).

**Why Resend?** It delivers reliably from serverless hosts (Vercel/Netlify),
has a generous free tier, native attachment support, and a simple API. The route
calls Resend's REST API directly with `fetch`, so there's **no extra dependency**
to install.

### What happens on submit

1. **The business** gets a full notification email (all answers + any photos
   attached), with the customer set as `Reply-To`.
2. **The customer** gets a friendly confirmation email that includes the **$30
   deposit** direct-deposit details (configured in `data/site.ts → booking`).

### One-time setup

1. Create a free account at **[resend.com](https://resend.com)** and generate an
   **API key**.
2. Add & verify your sending domain (e.g. `cleanhousecollective.com.au`). For a
   quick test with no domain, you can use Resend's shared sender
   `onboarding@resend.dev` (it only delivers to the address you signed up with).
3. Copy the env template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   QUOTE_FROM="Clean House Collective <quotes@cleanhousecollective.com.au>"
   QUOTE_TO=cleanhousecollective@outlook.com
   ```
4. Run `npm run dev` and submit a test quote.

**Deploying to Vercel:** add the same three variables under **Project → Settings
→ Environment Variables**, then redeploy. Nothing else to change.

> If `RESEND_API_KEY` isn't set, the endpoint returns 503 and the front-end
> gracefully falls back to opening the visitor's email client via `mailto:`
> (note: `mailto:` can't carry photo attachments).

### 💳 Booking deposit — update the bank details

The $30 deposit and its **direct-deposit bank details** live in
`data/site.ts → site.booking`. The placeholders (`BSB 000-000`, account
`0000 0000`) are emailed to the customer on submission, so **replace them with
the real account details before going live**.


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

> **Before launch:** replace the placeholder **deposit bank details** in
> `site.booking.bank` (BSB & account number) with the real account information.
> The business phone (`0499 930 422`) and **ABN** (`48 701 813 578`) are already
> set in `site.contact` and `site.abn`.

### Branding

Brand colours (matching the logo) live in `tailwind.config.ts`:
Emerald `#0D4F45`, Sage `#86A88A`, Cream `#FAFAF7`, Charcoal `#1E1E1E`.
The logo is at `public/logo.png`.

---

## 📁 Project structure

```
clean-house-collective/
├── app/
│   ├── api/quote/route.ts   # ✉️ Email endpoint (Resend: business + customer)
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
