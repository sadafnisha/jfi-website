"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Send } from "lucide-react";

/* Shared field styles: identical to the Contact Us form (src/components/ContactForm.tsx),
   with text-base so mobile browsers do not zoom the page when a field is focused. */
const inputClass =
  "mt-1.5 block w-full min-w-0 max-w-full rounded-md border border-navy/25 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold";

const fileClass = `${inputClass} cursor-pointer p-2 text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-700`;

const labelClass = "block text-sm font-semibold text-navy";
const hintClass = "mt-1.5 text-xs leading-5 text-ink/70";
const checkboxLabelClass =
  "flex cursor-pointer items-start gap-3 rounded-md border border-navy/10 bg-mist p-3.5 text-sm leading-6 text-ink";
const checkboxClass = "mt-0.5 h-5 w-5 shrink-0 accent-navy";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/** Numbered section heading used for the six parts of the form. */
function FormSection({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  const headingId = `join-section-${number}`;
  return (
    <section aria-labelledby={headingId}>
      <div className="mb-6 flex items-center gap-3 border-b border-navy/10 pb-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-base font-bold text-gold"
          aria-hidden="true"
        >
          {number}
        </span>
        <h3 id={headingId} className="font-serif text-xl font-bold">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export default function JoinUsForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  function showError(text: string) {
    setMessage(text);
    setMessageType("error");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") || "").trim();
    const alternatePhone = String(data.get("alternatePhone") || "").trim();
    const pinCode = String(data.get("pinCode") || "").trim();
    const file = data.get("idProof");
    const panNumber = String(data.get("panNumber") || "").trim().toUpperCase();
    const panCard = data.get("panCard");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      showError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (alternatePhone && !/^[6-9]\d{9}$/.test(alternatePhone)) {
      showError("Enter a valid alternate mobile number or leave it blank.");
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      showError("PIN code must contain exactly 6 digits.");
      return;
    }

    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      showError("ID proof must be 5 MB or smaller.");
      return;
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      showError("Enter a valid PAN number, for example ABCDE1234F, or leave it blank.");
      return;
    }

    if (panCard instanceof File && panCard.size > 5 * 1024 * 1024) {
      showError("PAN card must be 5 MB or smaller.");
      return;
    }

    setSubmitting(true);

    try {
      // This endpoint must be implemented on your backend.
      // The backend must validate the data and securely store uploaded files.
      const response = await fetch("/api/join-us", {
        method: "POST",
        body: data,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            (response.status >= 500
              ? "Could not reach the server. Please make sure the backend is running, then try again."
              : "The application could not be submitted. Please try again later.")
        );
      }

      setMessage(result.message || "Your application has been submitted successfully.");
      setMessageType("success");
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to submit your application. Please try again."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-gold via-white to-brand-green" aria-hidden="true" />

      <div className="border-b border-navy/10 px-5 py-6 sm:px-8 lg:px-10">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">Membership Application Form</h2>
        <div className="mt-3 h-1 w-14 rounded bg-gold" aria-hidden="true" />
        <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
          Please complete all mandatory fields marked with an asterisk (*). Submit accurate information for
          membership review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 p-5 sm:p-8 lg:p-10">
        {/* PERSONAL INFORMATION */}
        <FormSection number={1} title="Personal Information">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={labelClass} htmlFor="fullName">
                Full Name *
              </label>
              <input
                className={inputClass}
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="guardianName">
                Father&apos;s / Mother&apos;s / Guardian&apos;s Name *
              </label>
              <input
                className={inputClass}
                id="guardianName"
                name="guardianName"
                type="text"
                placeholder="Enter parent or guardian name"
                maxLength={100}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="dob">
                Date of Birth *
              </label>
              <input
                className={inputClass}
                id="dob"
                name="dob"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="gender">
                Gender (Optional)
              </label>
              <select className={inputClass} id="gender" name="gender" defaultValue="">
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="min-w-0 sm:col-span-2">
              <label className={labelClass} htmlFor="photo">
                Profile Photograph (Optional)
              </label>
              <input
                className={fileClass}
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              />
              <p className={hintClass}>JPG, PNG or WebP. Maximum 5 MB.</p>
            </div>
          </div>
        </FormSection>

        {/* CONTACT DETAILS */}
        <FormSection number={2} title="Contact Information">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={labelClass} htmlFor="phone">
                Mobile Number *
              </label>
              <div className="mt-1.5 flex overflow-hidden rounded-md border border-navy/25 bg-white focus-within:border-navy focus-within:ring-2 focus-within:ring-gold">
                <span className="flex items-center border-r border-navy/25 bg-mist px-3 text-base font-semibold text-navy">
                  +91
                </span>
                <input
                  className="min-w-0 flex-1 bg-white px-3 py-3 text-base text-ink outline-none placeholder:text-ink/40 focus:outline-none"
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  minLength={10}
                  maxLength={10}
                  onChange={(event) => {
                    event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
                  }}
                  required
                />
              </div>
              <p className={hintClass}>Enter 10 digits without +91.</p>
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="email">
                Email Address *
              </label>
              <input
                className={inputClass}
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="alternatePhone">
                Alternate Mobile Number (Optional)
              </label>
              <input
                className={inputClass}
                id="alternatePhone"
                name="alternatePhone"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10);
                }}
              />
            </div>
          </div>
        </FormSection>

        {/* ADDRESS */}
        <FormSection number={3} title="Address Details">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0 sm:col-span-2">
              <label className={labelClass} htmlFor="address">
                House Number, Street and Locality *
              </label>
              <textarea
                className={inputClass}
                id="address"
                name="address"
                rows={3}
                placeholder="Enter your complete address"
                autoComplete="street-address"
                maxLength={500}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="city">
                Village / Town / City *
              </label>
              <input
                className={inputClass}
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                maxLength={100}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="district">
                District *
              </label>
              <input className={inputClass} id="district" name="district" type="text" maxLength={100} required />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="state">
                State / Union Territory *
              </label>
              <select
                className={inputClass}
                id="state"
                name="state"
                defaultValue=""
                autoComplete="address-level1"
                required
              >
                <option value="">Select state / UT</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="pinCode">
                PIN Code *
              </label>
              <input
                className={inputClass}
                id="pinCode"
                name="pinCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 6);
                }}
                required
              />
            </div>
          </div>
        </FormSection>

        {/* ID VERIFICATION */}
        <FormSection number={4} title="Identity Verification">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={labelClass} htmlFor="idType">
                ID Proof Type *
              </label>
              <select className={inputClass} id="idType" name="idType" defaultValue="" required>
                <option value="">Select ID proof</option>
                <option value="voter-id">Voter ID</option>
                <option value="driving-licence">Driving Licence</option>
                <option value="passport">Passport</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="other">Other government-issued ID</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="idProof">
                Upload ID Proof *
              </label>
              <input
                className={fileClass}
                id="idProof"
                name="idProof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                required
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (!file) return;

                  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

                  if (!allowedTypes.includes(file.type)) {
                    event.currentTarget.value = "";
                    showError("Upload your ID as a PDF, JPG or PNG.");
                  } else if (file.size > 5 * 1024 * 1024) {
                    event.currentTarget.value = "";
                    showError("ID proof must be 5 MB or smaller.");
                  } else {
                    setMessage("");
                  }
                }}
              />
              <p className={hintClass}>
                PDF, JPG or PNG. Maximum 5 MB. Avoid uploading unnecessary sensitive information.
              </p>
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="panNumber">
                PAN Number (Optional)
              </label>
              <input
                className={`${inputClass} uppercase`}
                id="panNumber"
                name="panNumber"
                type="text"
                placeholder="ABCDE1234F"
                autoComplete="off"
                maxLength={10}
                pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]"
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="panCard">
                Upload PAN Card (Optional)
              </label>
              <input
                className={fileClass}
                id="panCard"
                name="panCard"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (!file) return;

                  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

                  if (!allowedTypes.includes(file.type)) {
                    event.currentTarget.value = "";
                    showError("Upload your PAN card as a PDF, JPG or PNG.");
                  } else if (file.size > 5 * 1024 * 1024) {
                    event.currentTarget.value = "";
                    showError("PAN card must be 5 MB or smaller.");
                  } else {
                    setMessage("");
                  }
                }}
              />
              <p className={hintClass}>PDF, JPG or PNG. Maximum 5 MB.</p>
            </div>
          </div>
        </FormSection>

        {/* MEMBERSHIP */}
        <FormSection number={5} title="Membership Details">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={labelClass} htmlFor="unit">
                Preferred State / District / Local Unit *
              </label>
              <input
                className={inputClass}
                id="unit"
                name="unit"
                type="text"
                placeholder="Where would you like to join?"
                maxLength={150}
                required
              />
            </div>

            <div className="min-w-0">
              <label className={labelClass} htmlFor="role">
                Preferred Area of Contribution *
              </label>
              <select className={inputClass} id="role" name="role" defaultValue="" required>
                <option value="">Select an area</option>
                <option value="volunteer">Volunteer</option>
                <option value="social-justice">Social Justice</option>
                <option value="legal-awareness">Legal Awareness</option>
                <option value="community-service">Community Service</option>
                <option value="women-empowerment">Women Empowerment</option>
                <option value="youth-development">Youth Development</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="min-w-0 sm:col-span-2">
              <label className={labelClass} htmlFor="reason">
                Why do you want to join JFI? *
              </label>
              <textarea
                className={inputClass}
                id="reason"
                name="reason"
                rows={4}
                placeholder="Tell us how you would like to contribute..."
                minLength={10}
                maxLength={1500}
                required
              />
            </div>

            <div className="min-w-0 sm:col-span-2">
              <label className={labelClass} htmlFor="experience">
                Previous Organizational / Social Work Experience (Optional)
              </label>
              <textarea
                className={inputClass}
                id="experience"
                name="experience"
                rows={3}
                placeholder="Describe any relevant experience..."
                maxLength={1500}
              />
            </div>
          </div>
        </FormSection>

        {/* DECLARATIONS */}
        <FormSection number={6} title="Declaration and Consent">
          <div className="space-y-3">
            <label className={checkboxLabelClass}>
              <input className={checkboxClass} type="checkbox" name="accurateInformation" value="yes" required />
              <span>
                I declare that the information provided in this application is true and accurate to the best
                of my knowledge. *
              </span>
            </label>

            <label className={checkboxLabelClass}>
              <input className={checkboxClass} type="checkbox" name="conductAgreement" value="yes" required />
              <span>I agree to follow the applicable JFI constitution, rules, and code of conduct. *</span>
            </label>

            <label className={checkboxLabelClass}>
              <input className={checkboxClass} type="checkbox" name="privacyConsent" value="yes" required />
              <span>
                I have read the applicable privacy notice and consent to the processing of my information for
                membership review. *
              </span>
            </label>
          </div>

          <p className="mt-5 flex items-start gap-3 rounded-lg border border-gold/50 bg-gold/10 p-4 text-sm leading-relaxed text-ink">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
            <span>
              Identity documents contain sensitive personal information. Publish a privacy notice and implement
              secure, restricted document storage before accepting real applications.
            </span>
          </p>
        </FormSection>

        {/* Status message (only what the server really answered, or a validation problem) */}
        {message &&
          (messageType === "success" ? (
            <p
              role="status"
              className="flex items-start gap-3 rounded-md border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-ink"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" />
              {message}
            </p>
          ) : (
            <p
              role="alert"
              className="flex items-start gap-3 rounded-md border border-red-700/40 bg-red-50 p-4 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {message}
            </p>
          ))}

        <div className="border-t border-navy/10 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="btn-navy w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-56"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" /> Submit Application
              </>
            )}
          </button>

          <p className="mt-3 text-xs leading-5 text-ink/70">
            Fields marked * are mandatory. Submission requires a working backend endpoint.
          </p>
        </div>
      </form>
    </div>
  );
}
