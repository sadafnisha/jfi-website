import {
  Scale,
  Equal,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Users,
  Gem,
  Megaphone,
  Gavel,
  GraduationCap,
  Newspaper,
  Siren,
  Landmark,
  Ban,
  HandHeart,
  Search,
  Handshake,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* General introduction                                                        */
/* -------------------------------------------------------------------------- */
export const introduction = [
  "Justice Front of India (JFI) is an organization committed to promoting justice, equality, human rights, and constitutional values in India. We believe that justice is a fundamental right of every citizen and must be ensured without discrimination based on caste, creed, religion, gender, community, or place of birth.",
  "Our mission is to support those who are unable to access justice due to poverty, social exclusion, discrimination, or lack of legal awareness. Through legal assistance, public advocacy, pro bono litigation, paralegal training, and media engagement, JFI seeks to strengthen the rule of law and build a society where every individual can live with dignity, freedom, and equal opportunity.",
];

/* -------------------------------------------------------------------------- */
/* About Us                                                                    */
/* -------------------------------------------------------------------------- */
export const aboutParagraphs = [
  "Justice Front of India (JFI) emerged from a collective effort by like-minded individuals who share a common commitment to justice, social responsibility, and constitutional principles. United by the belief that access to justice should never depend on a person's financial position or social background, we came together with the intention of giving back to society by providing legal support and guidance to people in need.",
  "We work to bridge the gap between citizens and the justice system by promoting legal awareness, supporting vulnerable individuals, highlighting injustice, and encouraging institutional accountability.",
  "JFI believes that an informed citizenry, an accessible legal system, and accountable public institutions are essential pillars of a democratic society. Our efforts focus on ensuring that the rights and protections guaranteed by the Constitution of India are meaningful and accessible to all.",
];

export const aboutPrinciple =
  "Our guiding principle is simple: Justice is not a privilege for the powerful; it is a right that belongs to everyone.";

/* -------------------------------------------------------------------------- */
/* Vision and Mission                                                          */
/* -------------------------------------------------------------------------- */
export const visionParagraphs = [
  "To build an inclusive, equitable, and democratic India where justice is accessible to every individual, human rights are respected, constitutional values are upheld, and no person is denied dignity or equal treatment because of their identity, background, or economic circumstances.",
  "We envision a society where institutions function transparently, the rule of law prevails, and every citizen can seek justice without fear, discrimination, or unnecessary barriers.",
];

export type TitledItem = { title: string; text: string; icon: LucideIcon };

export const missionItems: TitledItem[] = [
  {
    title: "Access to Justice",
    text: "To help economically disadvantaged and socially vulnerable individuals access legal guidance, representation, and appropriate remedies.",
    icon: Scale,
  },
  {
    title: "Constitutional Awareness",
    text: "To educate citizens about their fundamental rights, constitutional safeguards, and legal responsibilities.",
    icon: BookOpen,
  },
  {
    title: "Equality and Non-Discrimination",
    text: "To challenge discrimination and advocate equal treatment irrespective of caste, creed, religion, gender, community, or place of birth.",
    icon: Equal,
  },
  {
    title: "Public Advocacy",
    text: "To raise public awareness about injustice, rights violations, and issues requiring institutional attention.",
    icon: Megaphone,
  },
  {
    title: "Legal Empowerment",
    text: "To develop community-level legal awareness through paralegal training, educational initiatives, and public engagement.",
    icon: GraduationCap,
  },
  {
    title: "Institutional Accountability",
    text: "To advocate transparent, fair, and accountable functioning of law enforcement agencies and public institutions.",
    icon: ShieldCheck,
  },
  {
    title: "Judicial and Police Reforms",
    text: "To encourage reforms that improve fairness, accessibility, efficiency, and public trust in the justice system.",
    icon: Gavel,
  },
  {
    title: "Social Harmony",
    text: "To promote fraternity, peaceful coexistence, and respect for the constitutional rights of all communities.",
    icon: HeartHandshake,
  },
];

/* -------------------------------------------------------------------------- */
/* Work and Initiatives                                                        */
/* -------------------------------------------------------------------------- */
export const initiatives: TitledItem[] = [
  {
    title: "Public Advocacy",
    text: "JFI uses public advocacy to highlight injustice, promote constitutional rights, and encourage authorities to address legitimate public grievances. Our approach includes representations to appropriate authorities, awareness campaigns, public discussions, and peaceful democratic engagement.",
    icon: Megaphone,
  },
  {
    title: "Pro Bono Litigation",
    text: "We seek to facilitate pro bono legal assistance for individuals who cannot afford legal services. By connecting people in need with willing legal professionals and appropriate legal resources, we aim to reduce barriers to justice. Legal representation and litigation support are subject to case assessment, the availability of qualified advocates, applicable laws, and professional obligations.",
    icon: Gavel,
  },
  {
    title: "Paralegal Training",
    text: "We aim to equip community members, volunteers, and aspiring legal workers with basic knowledge of legal rights, constitutional protections, complaint procedures, and access-to-justice mechanisms. Our goal is to develop informed communities that can identify rights violations, guide people towards appropriate legal remedies, and engage responsibly with public institutions.",
    icon: GraduationCap,
  },
  {
    title: "Media Highlights and Public Awareness",
    text: "JFI seeks to bring public attention to significant cases of injustice, human-rights concerns, and matters of public interest through responsible media engagement and digital communication. We aim to amplify the voices of affected individuals, encourage evidence-based public discussion, and promote accountability while respecting privacy, due process, and the dignity of all concerned.",
    icon: Newspaper,
  },
];

/** One-line summaries used only on the homepage preview. */
export const initiativeSummaries: Record<string, string> = {
  "Public Advocacy":
    "Highlighting injustice and promoting constitutional rights through peaceful democratic engagement.",
  "Pro Bono Litigation":
    "Facilitating pro bono legal assistance for people who cannot afford legal services.",
  "Paralegal Training":
    "Equipping communities with basic knowledge of legal rights and remedies.",
  "Media Highlights and Public Awareness":
    "Responsible media engagement that amplifies the voices of affected individuals.",
};

/* -------------------------------------------------------------------------- */
/* Key Areas of Advocacy                                                       */
/* -------------------------------------------------------------------------- */
export const advocacyAreas: TitledItem[] = [
  {
    title: "Police Reform",
    text: "We advocate fair, professional, transparent, and accountable policing. Our focus includes the protection of civil liberties, lawful arrest and investigation procedures, prevention of custodial abuse, and equal treatment of all citizens.",
    icon: Siren,
  },
  {
    title: "Judicial Reform",
    text: "We support efforts to make the justice system more accessible, affordable, timely, and responsive to the needs of ordinary citizens. We encourage legal aid, procedural fairness, greater awareness of legal remedies, and measures that strengthen public confidence in judicial institutions.",
    icon: Landmark,
  },
  {
    title: "Addressing Systemic Hate and Discrimination",
    text: "JFI is committed to addressing systemic hate, discriminatory practices, hate-motivated violence, and exclusion that undermine equality and social harmony. We seek to promote accountability through lawful means, support affected individuals in accessing appropriate remedies, and encourage a culture of fraternity, mutual respect, and constitutional morality. Our approach is rooted in the principle that every person deserves equal protection of the law, regardless of identity or background.",
    icon: Ban,
  },
];

export const advocacySummaries: Record<string, string> = {
  "Police Reform":
    "Fair, transparent, and accountable policing that protects civil liberties.",
  "Judicial Reform":
    "A justice system that is accessible, affordable, timely, and responsive.",
  "Addressing Systemic Hate and Discrimination":
    "Accountability through lawful means and equal protection of the law for all.",
};

/* -------------------------------------------------------------------------- */
/* Values                                                                      */
/* -------------------------------------------------------------------------- */
export const values: TitledItem[] = [
  {
    title: "Justice",
    text: "Equal access to legal remedies and fair treatment under the law.",
    icon: Scale,
  },
  {
    title: "Equality",
    text: "No discrimination based on caste, creed, religion, gender, community, or place of birth.",
    icon: Equal,
  },
  {
    title: "Constitutionalism",
    text: "Respect for the Constitution of India, fundamental rights, and the rule of law.",
    icon: BookOpen,
  },
  {
    title: "Human Dignity",
    text: "Recognition of the inherent worth and rights of every individual.",
    icon: Gem,
  },
  {
    title: "Accountability",
    text: "Encouraging transparent, lawful, and responsible institutional conduct.",
    icon: ShieldCheck,
  },
  {
    title: "Fraternity",
    text: "Promoting mutual respect, social harmony, and peaceful coexistence.",
    icon: Users,
  },
  {
    title: "Integrity",
    text: "Acting responsibly, ethically, and in good faith in the pursuit of justice.",
    icon: HandHeart,
  },
];

/* -------------------------------------------------------------------------- */
/* Support Us                                                                  */
/* -------------------------------------------------------------------------- */
export const supportHeading = "Stand for Justice. Become Part of the Change.";

export const supportIntro = [
  "Justice becomes meaningful when people come together to defend the rights of others. JFI welcomes the participation of individuals who believe in equality, constitutional values, human rights, and the principle that no one should be denied justice because they cannot afford it.",
  "You can support our work in the following ways:",
];

export const supportWays: TitledItem[] = [
  {
    title: "Volunteer",
    text: "Contribute your time and skills to legal awareness, research, outreach, and public advocacy.",
    icon: HandHeart,
  },
  {
    title: "Legal Support",
    text: "Qualified advocates and legal professionals can express interest in providing pro bono guidance or representation, subject to professional rules and case requirements.",
    icon: Gavel,
  },
  {
    title: "Paralegal Initiatives",
    text: "Help expand legal literacy and community awareness of constitutional rights.",
    icon: GraduationCap,
  },
  {
    title: "Media and Research",
    text: "Assist in documenting public-interest concerns, preparing research-based reports, and disseminating verified information.",
    icon: Search,
  },
  {
    title: "Community Outreach",
    text: "Help identify individuals who need legal guidance and connect them with appropriate support.",
    icon: Users,
  },
  {
    title: "Institutional Collaboration",
    text: "Partner with JFI on lawful, rights-based initiatives that advance access to justice and social welfare.",
    icon: Handshake,
  },
  {
    title: "Responsible Contributions",
    text: "Individuals and institutions may contact JFI to discuss support for its activities, subject to applicable laws and the organization's financial and compliance requirements.",
    icon: Wallet,
  },
];

export const supportClosing =
  "Your participation can help make justice more accessible to those who need it most.";

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */
export const contactIntro =
  "For legal assistance enquiries, public-interest concerns, volunteering, pro bono collaboration, media enquiries, or institutional partnerships, please contact our office.";

/* -------------------------------------------------------------------------- */
/* Our Commitment                                                              */
/* -------------------------------------------------------------------------- */
export const commitmentParagraphs = [
  "Justice Front of India stands for a society in which the law protects everyone equally and justice remains within the reach of every citizen.",
  "We believe that meaningful change begins when people stand up against injustice, support those whose voices go unheard, and work collectively to strengthen constitutional democracy.",
];

export const commitmentRefrain =
  "Justice for the Voiceless. Equality for Every Citizen. Dignity for All.";

export const commitmentSignoff =
  "Justice Front of India Standing for Justice, Defending Rights, Empowering People.";
