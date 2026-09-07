"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";
import { quoteSteps, site } from "@/data/site";
import { PhotoStep, type StagedPhoto } from "./PhotoStep";

type Answers = Record<string, string>;
type ContactInfo = { name: string; email: string; phone: string };
type Status = "idle" | "sending" | "success" | "error";

const emptyContact: ContactInfo = { name: "", email: "", phone: "" };

export function QuoteModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<ContactInfo>(emptyContact);
  const [photos, setPhotos] = useState<StagedPhoto[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const step = quoteSteps[stepIndex];
  const totalSteps = quoteSteps.length;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  // Reset whenever the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
      setAnswers({});
      setContact(emptyContact);
      setPhotos((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
      setStatus("idle");
      setErrorMsg(null);
    }
  }, [isOpen]);

  // Lock body scroll + Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const canContinue = useMemo(() => {
    if (!step) return false;
    if (step.type === "single") return Boolean(answers[step.id]);
    if (step.type === "text" || step.type === "photos") return true; // optional
    if (step.type === "contact")
      return (
        contact.name.trim() !== "" &&
        contact.email.trim() !== "" &&
        contact.phone.trim() !== ""
      );
    return false;
  }, [step, answers, contact]);

  if (!isOpen) return null;

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
    if (step.type === "single") window.setTimeout(goNext, 180);
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }
  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function buildSummary() {
    const labels: Record<string, string> = {
      service: "Service",
      frequency: "Frequency",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      extras: "Optional extras",
      suburb: "Suburb",
      notes: "Notes",
    };
    return Object.entries(labels)
      .map(([key, label]) => `${label}: ${answers[key] || "—"}`)
      .join("\n");
  }

  /**
   * Submit the quote. Primary path posts the answers + photos to the /api/quote
   * serverless route (which emails the business, attachments included). If that
   * endpoint isn't available (e.g. the site is deployed as a purely static
   * export), we fall back to opening the visitor's email client via mailto.
   */
  async function handleSubmit() {
    setStatus("sending");
    setErrorMsg(null);

    const form = new FormData();
    form.append("service", answers.service || "");
    form.append("frequency", answers.frequency || "");
    form.append("bedrooms", answers.bedrooms || "");
    form.append("bathrooms", answers.bathrooms || "");
    form.append("extras", answers.extras || "");
    form.append("suburb", answers.suburb || "");
    form.append("notes", answers.notes || "");
    form.append("name", contact.name);
    form.append("email", contact.email);
    form.append("phone", contact.phone);
    photos.forEach((p, i) =>
      form.append("photos", p.file, p.file.name || `photo-${i}.jpg`)
    );

    try {
      const res = await fetch("/api/quote", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
    } catch {
      // Fallback: mailto (note — attachments can't be included via mailto).
      openMailtoFallback();
    }
  }

  function openMailtoFallback() {
    const body =
      `New quote request from the website:\n\n` +
      `${buildSummary()}\n\n` +
      `--- Contact ---\n` +
      `Name: ${contact.name}\n` +
      `Email: ${contact.email}\n` +
      `Phone: ${contact.phone}\n\n` +
      (photos.length
        ? `(${photos.length} photo(s) selected — please attach them to this email.)\n\n`
        : "") +
      `Note: A ${site.booking.deposit} deposit secures the booking (details to be provided on confirmation).\n`;
    const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(
      `New Quote Request — ${answers.service || "Cleaning"}`
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("success");
  }

  const submitting = status === "sending";
  const done = status === "success";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request a cleaning quote"
    >
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream shadow-soft-lg animate-scale-in dark:bg-emerald-deep sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/10">
          <div>
            <p className="eyebrow">Free Quote</p>
            <h3 className="font-display text-xl font-bold">
              {done ? "Request sent!" : "Tell us about your home"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-black/5 dark:text-cream/70 dark:hover:bg-white/10"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        {!done && (
          <div className="h-1.5 w-full bg-black/5 dark:bg-white/10">
            <div
              className="h-full rounded-r-full bg-emerald transition-all duration-300 dark:bg-sage"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="modal-scroll flex-1 overflow-y-auto px-6 py-8">
          {done ? (
            <SuccessView onClose={onClose} />
          ) : (
            <div key={step.id} className="animate-fade-in">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-sage-dark dark:text-sage-light">
                Step {stepIndex + 1} of {totalSteps}
              </p>
              <h4 className="font-display text-2xl font-bold leading-snug">
                {step.question}
              </h4>
              {step.helper && (
                <p className="mt-2 text-sm text-charcoal/60 dark:text-cream/60">
                  {step.helper}
                </p>
              )}

              <div className="mt-6">
                {/* Single choice */}
                {step.type === "single" && step.options && (
                  <div className="grid gap-3">
                    {step.options.map((option) => {
                      const selected = answers[step.id] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => selectOption(option)}
                          className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all ${
                            selected
                              ? "border-emerald bg-emerald text-cream shadow-soft"
                              : "border-black/10 bg-white hover:border-emerald/40 dark:border-white/10 dark:bg-white/5"
                          }`}
                        >
                          {option}
                          {selected && <Icon name="check" className="h-5 w-5" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Free text */}
                {step.type === "text" && (
                  <textarea
                    autoFocus
                    rows={step.id === "notes" ? 4 : 2}
                    value={answers[step.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [step.id]: e.target.value,
                      }))
                    }
                    placeholder={
                      step.id === "suburb"
                        ? "e.g. Kallangur, 4503"
                        : "Pets, access details, preferred days, anything to focus on…"
                    }
                    className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm outline-none transition-colors focus:border-emerald dark:border-white/10 dark:bg-white/5"
                  />
                )}

                {/* Photos */}
                {step.type === "photos" && (
                  <PhotoStep photos={photos} setPhotos={setPhotos} />
                )}

                {/* Contact */}
                {step.type === "contact" && (
                  <div className="grid gap-4">
                    <Field
                      label="Full name"
                      value={contact.name}
                      onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                      placeholder="Jane Citizen"
                      autoFocus
                    />
                    <Field
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                      placeholder="jane@example.com"
                    />
                    <Field
                      label="Mobile"
                      type="tel"
                      value={contact.phone}
                      onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                      placeholder="0400 000 000"
                    />
                  </div>
                )}
              </div>

              {errorMsg && (
                <p className="mt-4 text-sm font-medium text-red-500">{errorMsg}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex items-center justify-between gap-3 border-t border-black/5 px-6 py-5 dark:border-white/10">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
              className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {stepIndex === totalSteps - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canContinue || submitting}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Sending…" : "Send request"}
                {!submitting && <Icon name="arrowRight" className="h-4 w-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step.type === "photos" && photos.length === 0 ? "Skip" : "Continue"}
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald text-cream">
        <Icon name="check" className="h-8 w-8" />
      </span>
      <h4 className="font-display text-2xl font-bold">Thanks — we&apos;re on it!</h4>
      <p className="mt-3 max-w-sm text-charcoal/70 dark:text-cream/70">
        Your quote request has been sent, and a confirmation is on its way to
        your inbox. We&apos;ll be in touch soon with your personalised flat-rate
        quote.
      </p>

      {/* Deposit note */}
      <div className="mt-6 w-full rounded-2xl border border-emerald/15 bg-emerald/5 p-5 text-left dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Icon
            name="tag"
            className="h-4 w-4 text-emerald dark:text-sage-light"
          />
          <p className="text-sm font-semibold text-emerald dark:text-sage-light">
            Securing your booking
          </p>
        </div>
        <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">
          A {site.booking.deposit} deposit (via direct deposit) secures your
          booking. We&apos;ve emailed you the bank details — no need to pay until
          we&apos;ve confirmed your quote. New clients also get{" "}
          {site.offers.newClient}!
        </p>
      </div>

      <p className="mt-4 text-xs text-charcoal/50 dark:text-cream/50">
        Prefer to reach us directly? {site.contact.email} ·{" "}
        {site.contact.phone}
      </p>
      <button type="button" onClick={onClose} className="btn-primary mt-6">
        Done
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-charcoal/60 dark:text-cream/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm outline-none transition-colors focus:border-emerald dark:border-white/10 dark:bg-white/5"
      />
    </label>
  );
}
