import { MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";

export default function ContactDetails() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-serif text-lg font-bold">Head Office</h3>
          <p className="text-sm font-semibold text-brand-green">Justice Front of India (JFI)</p>
          <address className="mt-2 not-italic leading-relaxed text-ink/85">
            {site.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
      </div>
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
          <Phone className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-serif text-lg font-bold">Contact Numbers</h3>
          <ul className="mt-2 space-y-1">
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <a
                  href={phone.href}
                  className="text-lg font-semibold text-navy underline-offset-4 hover:text-brand-green hover:underline"
                >
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
