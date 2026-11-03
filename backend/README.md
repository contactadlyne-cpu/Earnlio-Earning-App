# 🚀 Earnlio Hostinger Node.js & Express SMTP Authentication Backend

This standalone Node.js & Express backend is built to deploy on **Hostinger (Node.js App Deploy / VPS / cPanel)** for sending real email verification OTP codes and managing user signup, login, and password resets using **Hostinger SMTP Email**.

---

## 🛠️ Step 1: Uploading to Hostinger

1. Download or extract `backend-hostinger.zip`.
2. Upload all files into your Hostinger project directory (e.g. `public_html/api` or `/home/username/earnlio-backend`).
3. In your Hostinger Panel (**hPanel** -> **Node.js Web App** or **Terminal**):
   - Set **Entry Point**: `server.js`
   - Set **Node.js Version**: 18.x or 20.x
   - Run `npm install` inside the backend directory.

---

## 📧 Step 2: Setting Hostinger SMTP Email Credentials

1. Go to **Hostinger hPanel** -> **Emails** -> **Create Email Account** (e.g., `noreply@yourdomain.com`).
2. Copy your SMTP server details from Hostinger:
   - **SMTP Host**: `smtp.hostinger.com`
   - **SMTP Port**: `465` (SSL) or `587` (TLS)
   - **SMTP Username**: `noreply@yourdomain.com`
   - **SMTP Password**: *(your email password)*
3. Create a `.env` file inside your backend directory (copied from `.env.example`):

```env
PORT=5000
NODE_ENV=production

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_hostinger_email_password
SMTP_FROM="Earnlio Rewards <noreply@yourdomain.com>"

FRONTEND_URL=*
```

---

## ⚡ Step 3: Starting the Server

Run command:
```bash
npm start
```
Or use PM2 to keep it running 24/7 on Hostinger:
```bash
npm install -g pm2
pm2 start server.js --name "earnlio-backend"
pm2 save
```

---

## 📡 API Endpoints Included

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check & SMTP status |
| `POST` | `/api/auth/send-otp` | Sends 6-digit email OTP via Hostinger SMTP |
| `POST` | `/api/auth/verify-otp` | Verifies OTP code & completes signup/login |
| `POST` | `/api/auth/forgot-password` | Sends password reset OTP email |
| `POST` | `/api/auth/reset-password` | Resets user password with valid OTP code |

---

## 💡 Support & Notes
- If Hostinger blocks port 465, switch `SMTP_PORT` to `587` and `SMTP_SECURE` to `false`.
- The frontend automatically integrates with this backend endpoints.
