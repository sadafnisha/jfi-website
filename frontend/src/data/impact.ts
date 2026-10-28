/**
 * ============================================================================
 *  OUR IMPACT PAGE CONTENT – EDIT THIS FILE TO PUBLISH REAL MATERIAL
 * ============================================================================
 *  JFI has not supplied any verified photographs, videos, stories, achievements
 *  or testimonials yet, so every list below is EMPTY and the /our-impact page
 *  shows tidy "coming soon" panels. Nothing on the page is invented.
 *
 *  To publish something, add an object to the matching list below, put the
 *  file in /public, save, and the page updates automatically. No other code
 *  needs to change.
 *
 *  GOLDEN RULES (this is an official website):
 *    - Add only facts, dates, events and people that JFI has verified.
 *    - Add a testimonial only with the written consent of the person quoted.
 *    - Use real photographs from real JFI activities. Never use stock or
 *      AI-generated images to represent events or people.
 *    - Write meaningful `alt` text (what the photo actually shows).
 *    - Dates use the format "YYYY-MM-DD" (for example "2026-03-14").
 *
 *  FOLDERS FOR FILES (inside /public):
 *    /images/impact/stories/   -> story cover photos
 *    /images/impact/gallery/   -> gallery photos
 *    /images/impact/videos/    -> video thumbnail images
 *    /videos/                  -> video files (.mp4), if hosting videos yourself
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface ImpactStory {
  id: string;
  title: string;
  /** Two or three sentences. Cards show about four lines. */
  summary: string;
  /** For example "Legal Awareness" or "Public Advocacy". */
  category: string;
  /** Optional, "YYYY-MM-DD". */
  date?: string;
  /** Optional cover photo, for example "/images/impact/stories/legal-camp.jpg". */
  image?: string;
  /** Describes the photo for screen readers. Required whenever `image` is set. */
  imageAlt?: string;
  /** Where "Read Story" goes: a page on this site ("/...") or an https:// link. Leave out until a full story exists. */
  href?: string;
}

export interface ImpactAchievement {
  id: string;
  title: string;
  description: string;
  /** Optional, for example "2026". */
  year?: string;
}

export interface ImpactGalleryImage {
  id: string;
  /** For example "/images/impact/gallery/awareness-programme-01.jpg". */
  src: string;
  /** Describes what the photo actually shows. */
  alt: string;
  /** Short caption shown in the viewer. */
  caption?: string;
  /** Used for the filter buttons, for example "Legal Awareness". */
  category: string;
  /** Optional, "YYYY-MM-DD". */
  date?: string;
}

export type ImpactVideoSource =
  /** A video file you host yourself in /public/videos, for example "/videos/programme.mp4". */
  | { type: "file"; src: string }
  /** A YouTube video: use only the 11-character id (the part after "v=" in the link). */
  | { type: "youtube"; id: string }
  /** Any other https:// video page. It opens in a new tab. */
  | { type: "link"; url: string };

export interface ImpactVideo {
  id: string;
  title: string;
  description: string;
  /** Optional thumbnail, for example "/images/impact/videos/programme.jpg". */
  thumbnail?: string;
  source: ImpactVideoSource;
}

export interface ImpactTestimonial {
  id: string;
  /** The exact words the person agreed to share. */
  quote: string;
  /** How the person agreed to be named (an initial or "A beneficiary" is fine if they prefer privacy). */
  name: string;
  /** Optional context, for example a place or the programme they took part in. */
  context?: string;
}

/* -------------------------------------------------------------------------- */
/* Content lists (currently empty on purpose)                                  */
/* -------------------------------------------------------------------------- */

/** Featured stories. Example of the shape (do not copy the wording; use verified facts):
 *  { id: "story-1", title: "…", summary: "…", category: "Legal Awareness", date: "2026-03-14",
 *    image: "/images/impact/stories/story-1.jpg", imageAlt: "…", href: "/stories/story-1" }
 */
export const impactStories: ImpactStory[] = [];

/** Verified achievements, completed initiatives, recognitions and milestones.
 *  { id: "milestone-1", year: "2026", title: "…", description: "…" }
 */
export const impactAchievements: ImpactAchievement[] = [];

/** Photo gallery.
 *  { id: "photo-1", src: "/images/impact/gallery/photo-1.jpg", alt: "…", caption: "…", category: "Public Outreach" }
 */
export const impactGallery: ImpactGalleryImage[] = [];

/** Video stories.
 *  { id: "video-1", title: "…", description: "…", thumbnail: "/images/impact/videos/video-1.jpg",
 *    source: { type: "youtube", id: "XXXXXXXXXXX" } }
 */
export const impactVideos: ImpactVideo[] = [];

/** Stories of change. Add only with the written consent of the person quoted.
 *  { id: "voice-1", quote: "…", name: "…", context: "…" }
 */
export const impactTestimonials: ImpactTestimonial[] = [];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** "2026-03-14" -> "14 March 2026". Returns "" for a missing or invalid date. */
export function formatImpactDate(value?: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  // Fixed time zone so server and browser always print the same text.
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Accepts only a plain 11-character YouTube id (stops anything else being put into an embed URL). */
export function isValidYouTubeId(value: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(value);
}

/** Internal paths ("/...") and https:// links only. */
export function isSafeHref(value?: string): value is string {
  if (!value) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
