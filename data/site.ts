/**
 * Central content & configuration file for Clean House Collective.
 *
 * All copy, contact details, services, pricing, reviews, FAQs and the quote
 * questionnaire live here so the site is easy to refine as the business grows.
 *
 * Content sourced from the business's own materials:
 *  - "Clean House Collective — Flat-Rate" company document
 *  - Airtasker 5-star client reviews
 */

export const site = {
  name: "Clean House Collective",
  tagline: "Come home to fresh, without the fuss.",
  description:
    "Regular domestic house cleaning based in Kallangur, servicing homes within approximately a 30 km radius across North Brisbane & Moreton Bay. Simple, all-inclusive flat-rate pricing.",

  // ---- Business / legal details ----
  abn: "48 701 813 578", // ABN 48701813578, formatted XX XXX XXX XXX

  // ---- Contact details ----
  contact: {
    phone: "0499 930 422",
    phoneHref: "tel:+61499930422",
    email: "cleanhousecollective@outlook.com",
    baseLocation: "Kallangur, QLD",
    serviceArea: "Kallangur & ~30 km radius",
  },

  // ---- New client / referral offers ----
  offers: {
    newClient: "$20 off your first Refresh",
    referral: "$20 off your next Refresh when you refer a friend",
  },

  // ---- Booking deposit ----
  // A small deposit secures each booking. For now this is handled by direct
  // deposit — the bank details below are emailed to the customer when we reply
  // to their quote request. TODO: replace the placeholder bank details with the
  // real account information.
  booking: {
    deposit: "$30",
    depositBlurb:
      "A $30 deposit secures your booking. Once we confirm your quote, we'll send our direct deposit details so you can lock in your spot.",
    bank: {
      accountName: "Clean House Collective",
      bsb: "014-309", // TODO: real BSB
      accountNumber: "8183 4387 8", // TODO: real account number
      reference: "Clean House Collective Kallangur",
    },
  },

  social: {
    facebook: "",
    instagram: "",
  },
} as const;

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export type Service = {
  title: string;
  tagline: string;
  description: string;
  price?: string;
  icon: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    title: "Standard Refresh",
    tagline: "Regular maintenance cleaning",
    description:
      "Our signature ongoing clean for homes that need regular maintenance. Available weekly, fortnightly or monthly — as well as one-off cleans. A flat-rate price for the service, not the clock.",
    price: "From $120 per clean",
    icon: "sparkles",
    featured: true,
  },
  {
    title: "Deep Refresh",
    tagline: "Extra care where it's needed most",
    description:
      "Ideal for first-time clients, seasonal cleaning, or homes that haven't been professionally cleaned in a while. Individually quoted based on your home's size, layout and condition.",
    price: "Personalised quote",
    icon: "shine",
  },
  {
    title: "Optional Extras",
    tagline: "Add a little something extra",
    description:
      "Oven refresh, gas stove deep clean, fridge interior, interior windows, inside cupboards, extra bathrooms, additional rooms or wall cleaning — arranged before your booking.",
    price: "Quoted per task",
    icon: "heart",
  },
];

// Standard Refresh pricing tiers (from the company flat-rate document)
export const pricing = [
  { label: "1 Bathroom Home", price: "$120", unit: "per clean" },
  { label: "2 Bathroom Home", price: "$150", unit: "per clean" },
];

// What's included in a Standard Refresh
export const standardInclusions: string[] = [
  "Kitchen",
  "Bathroom/s",
  "Up to 4 bedrooms",
  "Toilets",
  "Dusting of accessible surfaces",
  "Mirrors",
  "Vacuuming",
  "Mopping",
  "Bins emptied",
];

// Optional extras that can be added to a Standard Refresh
export const optionalExtras: string[] = [
  "Oven refresh",
  "Gas stove deep clean",
  "Fridge interior",
  "Interior windows",
  "Inside cupboards",
  "Extra bathrooms",
  "Additional rooms",
  "Wall cleaning",
];

// "Why choose us" value props — drawn from the all-inclusive flat-rate promise
export const valueProps = [
  {
    icon: "shield",
    title: "All-inclusive flat rate",
    text: "Your quoted price includes fuel, insurance, professional equipment, products and labour. Nothing for you to supply.",
  },
  {
    icon: "clock",
    title: "Priced for the service, not the clock",
    text: "We focus on completing your agreed Refresh thoroughly, without rushing your home or watching the clock.",
  },
  {
    icon: "leaf",
    title: "Gentle, carefully chosen products",
    text: "We avoid harsh or abrasive products wherever possible — and we're happy to use your own on request.",
  },
  {
    icon: "check",
    title: "No surprises on cleaning day",
    text: "You'll know your agreed service and flat-rate price before we arrive. Every time.",
  },
];

// ---------------------------------------------------------------------------
// Service area
// ---------------------------------------------------------------------------

export const serviceAreas: string[] = [
  "Kallangur",
  "North Lakes",
  "Petrie",
  "Strathpine",
  "Murrumba Downs",
  "Mango Hill",
  "Kippa-Ring",
  "Redcliffe",
  "Deception Bay",
  "Narangba",
  "Dakabin",
  "Griffin",
];

// ---------------------------------------------------------------------------
// Reviews (18 five-star Airtasker reviews)
// ---------------------------------------------------------------------------

export type Testimonial = {
  quote: string;
  name: string;
  service: string;
  timeAgo: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Wonderful job! Worked around me and a newborn baby so 10 points for that!!!!! Did exactly what I asked for.",
    name: "Dani C.",
    service: "House clean",
    timeAgo: "7 months ago",
    rating: 5,
  },
  {
    quote: "Sarah was quick and efficient and did a fantastic job!",
    name: "Mia W.",
    service: "General clean, 2 bedroom house",
    timeAgo: "7 months ago",
    rating: 5,
  },
  {
    quote:
      "AMAZING AMAZING AMAZING, great work. Will definitely use you again. Thank u",
    name: "Samantha L.",
    service: "End of lease clean",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "Great detailed job and good communication.",
    name: "Lata P.",
    service: "House cleaning, 3 rooms 2 bathrooms",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "So easy to deal with, great communication. Highly recommend.",
    name: "Julie G.",
    service: "General house clean",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "Great job, will book again.",
    name: "F M.",
    service: "Clean 1 bedroom flat",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote:
      "Sarah did a great job. I had to reschedule due to my injury but she was understanding and very kind. Highly recommended.",
    name: "Misha S.",
    service: "3 bathrooms & living/dining area",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "Absolutely lovely, great communication, happy.",
    name: "Nina P.",
    service: "Weekly cleaning",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "Great job will use again.",
    name: "Clinton M.",
    service: "Bathrooms & toilets cleaned",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "Thanks Sarah and partner! Very prompt, friendly, efficient and did a great job!",
    name: "Bek P.",
    service: "3 bathrooms & mop, 2 storey home",
    timeAgo: "8 months ago",
    rating: 5,
  },
  {
    quote: "She is lovely and very fast in her job.",
    name: "Kimiya B.",
    service: "House cleaning",
    timeAgo: "9 months ago",
    rating: 5,
  },
  {
    quote: "Excellent service, spotless cleaning — would highly recommend.",
    name: "Peter H.",
    service: "House clean",
    timeAgo: "9 months ago",
    rating: 5,
  },
  {
    quote: "Thanks Sarah! Timely & responsive.",
    name: "Caisha H.",
    service: "Home clean",
    timeAgo: "9 months ago",
    rating: 5,
  },
  {
    quote: "Great work, very efficient.",
    name: "Sharyn G.",
    service: "Fortnightly cleaner",
    timeAgo: "10 months ago",
    rating: 5,
  },
  {
    quote: "Very happy with Sarah's work. Thank you.",
    name: "Kelly M.",
    service: "House clean",
    timeAgo: "10 months ago",
    rating: 5,
  },
  {
    quote:
      "Sarah did a great job! Very efficient and timely, will definitely be using her from now on!",
    name: "Michelle R.",
    service: "Clean communal areas of townhouse",
    timeAgo: "11 months ago",
    rating: 5,
  },
  {
    quote:
      "Amazing work and professional friendly service. Will have Sarah back regularly.",
    name: "Matt Y.",
    service: "Bathrooms and floors cleaned",
    timeAgo: "11 months ago",
    rating: 5,
  },
  {
    quote:
      "Sarah was super friendly, did the job quickly and did the job well! Would recommend to others.",
    name: "Kirralee D.",
    service: "Urgent clean — bathrooms, windows, floors",
    timeAgo: "11 months ago",
    rating: 5,
  },
];

// ---------------------------------------------------------------------------
// FAQ (built from the company's "A Few Things to Know" policies)
// ---------------------------------------------------------------------------

export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "How does your flat-rate pricing work?",
    answer:
      "Your quoted flat rate is for the service, not an hourly booking. It includes fuel, insurance, professional equipment, cleaning products and labour — there's nothing for you to supply. Your final price is confirmed before your first clean, based on the size, layout and typical cleaning requirements of your home.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Every home is a little different. Before your first clean we'll ask you to send through a few current photos or a short video of the main areas — particularly the kitchen and bathroom/s. And please, don't tidy up for us! Seeing your home as it normally is helps us provide an accurate flat-rate quote with no surprises on cleaning day.",
  },
  {
    question: "Do I need to be home during the clean?",
    answer:
      "Not at all. If you won't be home, we'll arrange a suitable method of access beforehand — a key, lockbox, garage access or another agreed arrangement. Any keys, codes or alarm information are treated confidentially and used only to access your home for your service.",
  },
  {
    question: "Do you provide cleaning products and equipment?",
    answer:
      "Yes. We arrive fully equipped with professional products and equipment, and we avoid harsh or abrasive products wherever possible. Prefer us to use your own products — or avoid something in particular? Just let us know before your clean.",
  },
  {
    question: "What's your cancellation policy?",
    answer:
      "We understand plans change! Please give us as much notice as possible. Cancellations or rescheduling with less than 24 hours' notice incur a 50% fee based on your booked service price. If we can't access your home at the agreed time, the booking may also be treated as a late cancellation.",
  },
  {
    question: "Which suburbs do you service?",
    answer:
      "We're based in Kallangur and service homes within approximately a 30 km radius across North Brisbane and the Moreton Bay region. Outside our usual area? Get in touch — we may still be able to help, though a small travel fee may apply.",
  },
  {
    question: "Do you have any offers for new clients?",
    answer:
      "Yes! New clients receive $20 off their first Refresh. Love coming home to a freshly cleaned house? Refer a friend who becomes a regular client and you'll receive $20 off your next Refresh too.",
  },
];

// ---------------------------------------------------------------------------
// Quote questionnaire
// ---------------------------------------------------------------------------

export type QuoteStep = {
  id: string;
  question: string;
  helper?: string;
  type: "single" | "text" | "photos" | "contact";
  options?: string[];
};

/**
 * Multi-step quote questionnaire. The modal renders itself from this array,
 * so steps can be added, removed or reordered here.
 *
 * The "photos" step lets clients optionally upload or capture photos of the
 * main areas of their home — mirroring the business's real quoting process.
 */
export const quoteSteps: QuoteStep[] = [
  {
    id: "service",
    question: "What are you after?",
    type: "single",
    options: [
      "Standard Refresh (regular)",
      "One-Off Clean",
      "Deep Refresh",
      "Not sure yet",
    ],
  },
  {
    id: "frequency",
    question: "How often would you like your Refresh?",
    type: "single",
    options: ["Weekly", "Fortnightly", "Monthly", "One-off"],
  },
  {
    id: "bedrooms",
    question: "How many bedrooms?",
    type: "single",
    options: ["1", "2", "3", "4", "5+"],
  },
  {
    id: "bathrooms",
    question: "How many bathrooms?",
    type: "single",
    options: ["1", "2", "3", "4+"],
  },
  {
    id: "extras",
    question: "Any optional extras?",
    helper: "Choose one to start — you can mention more in the notes.",
    type: "single",
    options: [
      "None",
      "Oven refresh",
      "Fridge interior",
      "Interior windows",
      "Inside cupboards",
      "Other (add in notes)",
    ],
  },
  {
    id: "suburb",
    question: "Which suburb are you in?",
    helper: "We're based in Kallangur and service ~30 km around it.",
    type: "text",
  },
  {
    id: "photos",
    question: "Add photos of your home",
    helper:
      "Optional but super helpful! A few photos of your kitchen and bathroom/s help us give an accurate flat-rate quote. And please — don't tidy up for us!",
    type: "photos",
  },
  {
    id: "notes",
    question: "Anything else we should know?",
    helper: "Pets, access details, preferred days, or anything to focus on.",
    type: "text",
  },
  {
    id: "contact",
    question: "Where can we send your quote?",
    helper:
      "We'll reply with your personalised flat-rate quote. A $30 deposit (via direct deposit) secures your booking once you're ready — we'll include the details in our reply.",
    type: "contact",
  },
];

// Photo upload limits (kept modest so email attachments stay deliverable)
export const photoLimits = {
  maxFiles: 6,
  maxSizeMB: 8,
};
