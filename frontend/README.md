# Justice Front of India (JFI) – Website

A multi-page website for **Justice Front of India (JFI)** built with Next.js (App Router), React, TypeScript and Tailwind CSS. Works on Windows, macOS and Linux, and is set up for VS Code.

> **Tagline:** “Justice for All. Equality for Everyone. Dignity for Every Citizen.”

## Important notes before you start

- **Build status:** this project was written in an environment that could not reach the npm registry, so `npm install`, `npm run build` and `npm run dev` were **not run** before delivery. The first thing to do on your machine is `npm install` followed by `npm run build`; if anything fails, the error message will point to the exact file.
- **Homepage Hero:** the originally approved Hero design was not available, so `src/components/Hero.tsx` is a new, separate component using the exact organization name and tagline. It is self-contained – replacing that one file with the approved Hero restores the original design without touching anything else.
- **Logo:** your supplied logo is used (`public/jfi-logo.png`, resized to 768 px for fast loading). Replace the file with the original full-resolution logo if you prefer.
- **Contact form:** it validates input but **does not send messages** until a backend is connected (see below). The form says so honestly to visitors.
- **Social links:** no official URLs were supplied, so they appear as clearly marked “link to be added” placeholders.

## 1. Extract and open

1. Right-click `jfi-website.zip` → **Extract All…** (Windows) or double-click it (macOS).
2. Open **VS Code** → **File → Open Folder…** → choose the extracted `jfi-website` folder.
3. Open a terminal in VS Code (**Terminal → New Terminal**).

## 2. Install and run

Requires **Node.js 18.18 or newer** (Node 20 or 22 recommended) – download from https://nodejs.org.

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

Other commands:

```bash
npm run build       # production build
npm start           # serve the production build
npm run typecheck   # TypeScript check only
```

## 3. Pages (all separate routes)

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about-us` | About Us |
| `/vision-and-mission` | Vision and Mission |
| `/our-executive-team` | Our Executive Team |
| `/our-work-and-initiatives` | Our Work and Initiatives |
| `/key-areas-of-advocacy` | Our Key Areas of Advocacy |
| `/our-values` | Our Values |
| `/support-us` | Support Us |
| `/contact-us` | Contact Us |
| `/our-commitment` | Our Commitment |

## 4. Project structure

```
jfi-website/
├── public/
│   ├── jfi-logo.png
│   └── images/
│       ├── hero/          (reserved for hero images)
│       ├── about/         (reserved for about-page images)
│       ├── team/          (member photographs – see below)
│       └── initiatives/   (reserved for initiative images)
├── src/
│   ├── app/               (one folder per route + layout, globals.css, error/loading/not-found)
│   ├── components/        (Navbar, Footer, Hero, PageBanner, TeamCard, ContactForm, ...)
│   └── data/
│       ├── site.ts        (name, tagline, address, phones, navigation, social links)
│       ├── content.ts     (all page text: about, mission, initiatives, values, ...)
│       └── teamMembers.ts (the nine executive team members)
├── tailwind.config.ts     (brand colours)
├── package.json
└── README.md
```

Brand colours (in `tailwind.config.ts`): Navy `#171D55`, Gold `#E8A23A`, Green `#278A43`, White `#FFFFFF`, Light background `#F7F8FC`, Text `#25283A`.

## 5. Replace the logo

Replace `public/jfi-logo.png` with your logo file (keep the same file name). It is used in the header, footer, homepage Hero, About Us page and browser tab icon.

## 6. Add team photographs

Place each photograph in `public/images/team/` using **exactly** these file names:

| Member | File |
| --- | --- |
| Dr. Faizul Hasan | `public/images/team/faizul-hasan.jpg` |
| Moin Ahmad Khan | `public/images/team/moin-ahmad-khan.jpg` |
| Chaudhry Salman Hussain | `public/images/team/salman-hussain.jpg` |
| Shams Quraish | `public/images/team/shams-quraish.jpg` |
| Shabi Ali Khan | `public/images/team/shabi-ali-khan.jpg` |
| Rizwan Malik | `public/images/team/rizwan-malik.jpg` |
| Salahuddin Hindal | `public/images/team/salahuddin-hindal.jpg` |
| Asad Khan | `public/images/team/asad-khan.jpg` |
| Fahmeena Tanveer | `public/images/team/fahmeena-tanveer.jpg` |

Square or portrait photos work best (the card crops to a square, anchored to the top so faces stay visible). Until a photo is added, the card shows an elegant placeholder with the member's initials – there are no broken-image icons. To use a different file name or format, edit the `image` field in `src/data/teamMembers.ts`.

## 7. Configure social links

Open `src/data/site.ts` and fill in the `url` of each entry in `socialLinks`, for example:

```ts
{ label: "Facebook", url: "https://www.facebook.com/your-official-page" },
```

Entries with an empty `url` show as non-clickable “link to be added” placeholders in the footer and on the Contact page. Entries with a URL become real links automatically.

## 8. Contact details and content

- Address and phone numbers: `src/data/site.ts`
- Page text: `src/data/content.ts`
- Team biographies: `src/data/teamMembers.ts`

## 9. Connect the contact form to a backend

The form lives in `src/components/ContactForm.tsx`. It validates the fields (name, email, subject and message are required; phone is optional) and shows accessible success and error messages.

**Currently no message is sent.** To make it work, use either option:

**Option A – any service that accepts a JSON POST** (a form service, serverless function, etc.):

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_CONTACT_ENDPOINT=https://your-endpoint.example/submit`.
3. Restart `npm run dev`.

The form will POST `{ name, email, phone, subject, message }` as JSON and show a success message only when the endpoint returns a successful status.

**Option B – your own Next.js route handler:** create `src/app/api/contact/route.ts` that receives the JSON and sends an email with a provider of your choice (for example Resend, SendGrid or SMTP via Nodemailer), then set `NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact`. Add spam protection (for example a CAPTCHA or rate limiting) before going live.

## 10. Deployment

Any Next.js host works (Vercel, Netlify, a Node server, etc.). Run `npm run build` and follow your host's Next.js instructions.

## 11. Backend, admin panel and payments

The website now has an Express + MongoDB backend (`/backend`), an admin panel (`/admin/login`) and Razorpay donations.
See **SETUP-BACKEND.md** for setup and how payment bypass is prevented.
