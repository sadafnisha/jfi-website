export const site = {
  name: "Justice Front of India",
  shortName: "JFI",
  tagline: "Justice for All. Equality for Everyone. Dignity for Every Citizen.",
  logo: "/jfi-logo.png",
  address: [
    "LGF 18 B, Burlington Arcade Mall,",
    "Vidhan Sabha Marg, Husainganj,",
    "Lucknow, Uttar Pradesh – 226001, India.",
  ],
  phones: [
    { display: "+91 7844040011", href: "tel:+917844040011" },
    { display: "+91 9319211419", href: "tel:+919319211419" },
  ],
} as const;

export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; items: NavLink[] };
export type NavEntry = NavLink | NavGroup;

export function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/** Header navigation. Every entry opens its own dedicated page. */
export const navigation: NavEntry[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    items: [
      { label: "About Us", href: "/about-us" },
      { label: "Vision and Mission", href: "/vision-and-mission" },
      { label: "Our Values", href: "/our-values" },
      { label: "Our Commitment", href: "/our-commitment" },
    ],
  },
  {
    label: "Our Work",
    items: [
      { label: "Our Work and Initiatives", href: "/our-work-and-initiatives" },
      { label: "Our Key Areas of Advocacy", href: "/key-areas-of-advocacy" },
      { label: "Our Impact", href: "/our-impact" },
    ],
  },
  { label: "Our Executive Team", href: "/our-executive-team" },
  { label: "Support Us", href: "/support-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Join Us", href: "/join-us" },
];

/** Flat list of all ten pages (used by the footer). */
export const allPages: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Vision and Mission", href: "/vision-and-mission" },
  { label: "Our Executive Team", href: "/our-executive-team" },
  { label: "Our Work and Initiatives", href: "/our-work-and-initiatives" },
  { label: "Our Key Areas of Advocacy", href: "/key-areas-of-advocacy" },
  { label: "Our Impact", href: "/our-impact" },
  { label: "Our Values", href: "/our-values" },
  { label: "Support Us", href: "/support-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Join Us", href: "/join-us" },
  { label: "Our Commitment", href: "/our-commitment" },
];

/**
 * Social links. Official URLs have not been supplied yet, so `url` is empty.
 * While `url` is empty the site renders a clearly marked, non-clickable
 * placeholder. Paste the official URL (e.g. "https://www.facebook.com/...")
 * to turn it into a real link everywhere on the site.
 */
export const socialLinks: { label: string; url: string }[] = [
  { label: "Facebook", url: "https://www.facebook.com/JFIOffice" },
  { label: "X", url: "https://x.com/JFIOffice" },
  { label: "YouTube", url: "" },
  { label: "Instagram", url: "https://www.instagram.com/jfioffice" },
  { label: "LinkedIn", url: "" },
];
