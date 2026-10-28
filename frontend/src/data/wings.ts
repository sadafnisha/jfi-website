import { teamMembers, type TeamMember } from "./teamMembers";

export type WingKey = "mens" | "womens";

export type Wing = {
  key: WingKey;
  title: string;
  href: string;
  /** Short text shown on the card on the main Executive Team page. */
  cardText: string;
  /** Text under the banner on the wing's own page. */
  intro: string;
  /** Slugs (from teamMembers.ts) of the members officially assigned to this wing. */
  memberSlugs: string[];
};

/**
 * ============================================================================
 *  WING ASSIGNMENTS – JFI MUST CONFIRM
 * ============================================================================
 *  The existing team data does not say which wing each member belongs to, and
 *  none has been guessed. Until JFI confirms, both lists are EMPTY and each wing
 *  page shows a "to be updated" message.
 *
 *  To publish, add the member's `slug` (copy it from src/data/teamMembers.ts),
 *  for example:   memberSlugs: ["faizul-hasan", "moin-ahmad-khan"],
 * ============================================================================
 */
export const wings: Record<WingKey, Wing> = {
  mens: {
    key: "mens",
    title: "Men's Wing",
    href: "/our-executive-team/mens-wing",
    cardText: "Meet the members of Justice Front of India's Men's Wing.",
    intro: "The members of Justice Front of India's Men's Wing.",
    memberSlugs: ["faizul-hasan","moin-ahmad-khan","salman-hussain","salahuddin-hindal","shabi-ali-khan","shams-quraish","rizwan-malik","asad-khan"],
  },
  womens: {
    key: "womens",
    title: "Women's Wing",
    href: "/our-executive-team/womens-wing",
    cardText: "Meet the members of Justice Front of India's Women's Wing.",
    intro: "The members of Justice Front of India's Women's Wing.",
    memberSlugs: ["fahmeena-tanveer"],
  },
};

export function getWingMembers(key: WingKey): TeamMember[] {
  return wings[key].memberSlugs
    .map((slug) => teamMembers.find((member) => member.slug === slug))
    .filter((member): member is TeamMember => Boolean(member));
}
