# JFI Website

```
jfi-website/
├── frontend/   Next.js website + admin panel   (port 3000)
└── backend/    Express + MongoDB API           (port 5000)
```

Browser sirf frontend (3000) se baat karta hai. `/api/*` requests Next.js khud backend (5000) ko forward kar deta hai
(`frontend/next.config.mjs`), isliye admin login cookie same-origin rehti hai.

## 1. Setup (pehli baar)

### Backend
```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```
`backend/.env` me bharo: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, aur Razorpay keys.
JWT_SECRET banane ke liye: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

```bash
npm run seed:admin          # admin account banata hai (ya password reset karta hai)
npm run dev                 # http://localhost:5000
```
Admin banne ke baad `.env` se `ADMIN_PASSWORD` line hata do.

### Frontend (naye terminal me)
```bash
cd frontend
npm install
cp .env.example .env.local  # BACKEND_URL=http://localhost:5000
npm run dev                 # http://localhost:3000
```

## 2. Admin panel

Navbar me koi Admin link nahi hai. Sirf URL se kholo: **http://localhost:3000/admin/login**
(password box me aankh wale button se password dikh/chhup jata hai).

Login ke baad left sidebar me 5 sections:

| Section | Kya milta hai |
| --- | --- |
| **Application** | Join Us ke Membership Application Form ka poora data, Approve / Reject, note, search, CSV |
| **Donation Data** | Support Us se hui confirmed payments (amount, method, Payment ID), CSV |
| **KYC Pending** | Applicant ki photograph, ID proof (Aadhaar etc.), PAN card. **Verify KYC** dabane par "Verified user" likh kar aata hai (Undo bhi hai) |
| **Add Photos / Videos** | Photo/video upload. Ye home page par hero section ke theek neeche "Moments from Our Work" gallery me dikhte hain. Kuch upload nahi hai to section dikhta hi nahi, layout same rehta hai |
| **Messages** | Contact Us aur Support Us ke message forms se aaye messages. Unread count sidebar me dikhta hai |

Limits: gallery images 8 MB, videos 60 MB (MP4/WebM), ek baar me 10 files. KYC documents 5 MB.

## 3. Payment (Razorpay)

Details `backend/.env.example` me. Donation "paid" tabhi banti hai jab server Razorpay se confirm kare
(signature + payment fetch + order/amount match + signed webhook). Webhook URL: `https://AAPKA-DOMAIN/api/donations/webhook`
(events: `payment.captured`, `payment.failed`, `order.paid`).

## 4. Security notes
- Admin password bcrypt hash; login par rate-limit, 5 galat attempts par 15 min lock; httpOnly + SameSite=Strict cookie.
- KYC documents `backend/uploads/` me random naam se, public nahi; sirf admin login ke baad khulte hain.
  Gallery files `backend/uploads/media/` me hain aur public hain (jaanbujhkar, website par dikhane ke liye).
- Production me HTTPS lagao (`NODE_ENV=production`), `backend/uploads` ka backup lo, MongoDB ko internet par open mat chhodo.
- `.env` files git me commit mat karo.
- Aadhaar ka sirf document upload liya jata hai, Aadhaar *number* form me nahi manga jata (privacy).

## 5. Production
```bash
cd backend  && NODE_ENV=production npm start
cd frontend && npm run build && npm start
```
Frontend `.env.local` me `BACKEND_URL`, backend `.env` me `FRONTEND_URL` set karo.
