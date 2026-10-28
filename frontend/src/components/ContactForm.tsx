"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Send } from "lucide-react";
import { site } from "@/data/site";

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not-configured" }
  | { kind: "error"; message: string };

const empty: Fields = { name: "", email: "", phone: "", subject: "", message: "" };

/**
 * Set NEXT_PUBLIC_CONTACT_ENDPOINT (see .env.example) to a URL that accepts a
 * JSON POST. Until then the form validates input but does NOT send anything,
 * and tells the visitor so.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/messages";

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address, for example name@example.com.";
  }
  //if (values.phone.trim() && !/^[0-9+()\-\s]{7,18}$/.test(values.phone.trim())) {
    //errors.phone = "Please enter a valid phone number, or leave this field empty.";
  if (values.phone && !/^\d{10}$/.test(values.phone)) {
  errors.phone = "Please enter exactly 10 digits after +91.";
  }
    
  if (!values.subject.trim()) errors.subject = "Please enter a subject.";
  if (!values.message.trim()) {
    errors.message = "Please write your message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Please write at least 10 characters.";
  }
  return errors;
}

const inputClass =
  "mt-1.5 block w-full rounded-md border border-navy/25 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold aria-[invalid=true]:border-red-700";

export default function ContactForm({ source = "contact-us" }: { source?: "contact-us" | "support-us" }) {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  function update(field: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "error", message: "Please correct the highlighted fields and try again." });
      const first = (Object.keys(found) as (keyof Fields)[])[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!endpoint) {
      setStatus({ kind: "not-configured" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        ...values,
        phone: values.phone ? `+91 ${values.phone}` : "",
        source,
      }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || `Request failed with status ${response.status}`);
      }
      setStatus({ kind: "sent" });
      setValues(empty);
    } catch (error) {
      setStatus({
        kind: "error",
        message: `${
          error instanceof Error && !error.message.startsWith("Request failed")
            ? error.message
            : "Your message could not be sent."
        } You can also call us on ${site.phones.map((phone) => phone.display).join(" or ")}.`,
      });
    }
  }

  const describedBy = (field: keyof Fields) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-navy">
            Full name <span aria-hidden="true" className="text-red-700">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-sm font-medium text-red-700">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-navy">
            Email address <span aria-hidden="true" className="text-red-700">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm font-medium text-red-700">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="phone" className="text-sm font-semibold text-navy">
          Phone number{" "}
          <span className="font-normal text-ink/60">(optional)</span>
        </label>

        <div className="mt-1.5 flex w-full overflow-hidden rounded-md border border-navy/25 bg-white focus-within:border-navy focus-within:ring-2 focus-within:ring-gold">
          <span className="flex items-center border-r border-navy/20 bg-mist px-4 text-base font-semibold text-ink">
            +91
          </span>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="9876543210"
            value={values.phone}
            onChange={(event) =>
              update("phone", event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            className="block min-w-0 flex-1 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:outline-none"
          />
        </div>

    {errors.phone && (
      <p id="phone-error" className="mt-1.5 text-sm font-medium text-red-700">
        {errors.phone}
      </p>
    )}
  </div>

        <div>
          <label htmlFor="subject" className="text-sm font-semibold text-navy">
            Subject <span aria-hidden="true" className="text-red-700">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={values.subject}
            onChange={(event) => update("subject", event.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={describedBy("subject")}
            className={inputClass}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1.5 text-sm font-medium text-red-700">
              {errors.subject}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-navy">
          Message <span aria-hidden="true" className="text-red-700">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={inputClass}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-sm font-medium text-red-700">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="btn-navy disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status.kind === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" /> Send message
            </>
          )}
        </button>
        <p className="text-sm text-ink/60">Fields marked * are required.</p>
      </div>

      {/* Live region for status messages */}
      <div aria-live="polite" role="status" className="min-h-[1px]">
        {status.kind === "sent" && (
          <p className="flex items-start gap-3 rounded-md border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-ink">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" />
            Thank you. Your message has been sent to the JFI office.
          </p>
        )}
        {status.kind === "not-configured" && (
          <p className="flex items-start gap-3 rounded-md border border-gold/60 bg-gold/10 p-4 text-sm text-ink">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
            <span>
              Your details look complete, but this website is not yet connected to an email or messaging
              service, so <strong>your message has not been sent</strong>. Please contact the office directly on{" "}
              {site.phones.map((phone, index) => (
                <span key={phone.href}>
                  {index > 0 && " or "}
                  <a href={phone.href} className="font-semibold text-navy underline">
                    {phone.display}
                  </a>
                </span>
              ))}
              .
            </span>
          </p>
        )}
      </div>
      <div aria-live="assertive" role="alert" className="min-h-[1px]">
        {status.kind === "error" && (
          <p className="flex items-start gap-3 rounded-md border border-red-700/40 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
