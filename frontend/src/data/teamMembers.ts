export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string[];
  /** Place the real photograph at this path inside /public. */
  image: string;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "faizul-hasan",
    name: "Dr. Faizul Hasan",
    role: "National President, JFI",
    bio: [
      "Dr. Faizul Hasan is a social and political activist and the former President of the Aligarh Muslim University Students' Union (AMUSU). He is pursuing an LL.B. at the University of Lucknow and is committed to advancing social justice, constitutional awareness, human rights, and access to legal assistance for disadvantaged communities.",
      "As National President of JFI, he seeks to strengthen the organization's public advocacy, legal support initiatives, and commitment to equality and democratic values.",
    ],
    image: "/images/team/faizul-hasan.jpeg",
  },
  {
    slug: "moin-ahmad-khan",
    name: "Moin Ahmad Khan",
    role: "National Vice President, JFI",
    bio: [
      "Moin Ahmad Khan serves as the National Vice President of Justice Front of India and student of LLB from Lucknow University, contributing to the organization's leadership, coordination, and mission of promoting justice and social responsibility.",
    ],
    image: "/images/team/moin-ahmad-khan.jpeg",
  },
  {
    slug: "salman-hussain",
    name: "Chaudhry Salman Hussain",
    role: "National Chief General Secretary, JFI",
    bio: [
      "Chaudhry Salman Hussain serves as the National Chief General Secretary, a student of LLB from Lucknow University, supporting organizational administration, coordination, and the implementation of JFI's programmes and initiatives.",
    ],
    image: "/images/team/salman-hussain.jpeg",
  },
  {
    slug: "salahuddin-hindal",
    name: "Salahuddin Hindal",
    role: "National Secretary, JFI",
    bio: [
      "Salahuddin Hindal supports JFI's commitment to social responsibility, constitutional values, and access to justice.",
    ],
    image: "/images/team/salahuddin-hindal.jpeg",
  },
  {
    slug: "shabi-ali-khan",
    name: "Shabi Ali Khan",
    role: "National Joint Secretary, JFI",
    bio: [
      "Shabi Ali Khan serves as the National Joint Secretary, assisting with organizational coordination, communication, and the implementation of the organization's activities.",
    ],
    image: "/images/team/shabi-ali-khan.jpg",
  },
  {
    slug: "shams-quraish",
    name: "Shams Quraish",
    role: "National Treasurer, JFI",
    bio: [
      "Shams Quraish serves as the National Treasurer, responsible for supporting financial administration and promoting responsible financial management within the organization.",
    ],
    image: "/images/team/shams-quraish.jpeg",
  },
  {
    slug: "fahmeena-tanveer",
    name: "Fahmeena Tanveer",
    role: "National President - Women's Wing & Member- National Core Team, JFI",
    bio: [
      "Fahmeena Tanveer contributes to the collective work of Justice Front of India in advancing equality, dignity, and social justice.",
    ],
    image: "/images/team/fahmeena-tanveer.jpeg",
  },
  {
    slug: "rizwan-malik",
    name: "Rizwan Malik",
    role: "Member- Core Team, JFI",
    bio: [
      "Rizwan Malik contributes to the organization's collective efforts to promote justice, equality, and public welfare.",
    ],
    image: "/images/team/rizwan-malik.jpeg",
  },
  {
    slug: "asad-khan",
    name: "Asad Khan",
    role: "Member- Core Team, JFI",
    bio: [
      "Asad Khan is part of the JFI team, contributing to the organization's broader mission of public service and justice for all.",
    ],
    image: "/images/team/asad-khan.jpg",
  },

];
