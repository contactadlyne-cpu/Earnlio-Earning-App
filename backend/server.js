const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// In-Memory Data Store (Can be replaced with MongoDB/PostgreSQL)
const otpStore = new Map(); // email -> { code, expiresAt, type, name }
const userStore = new Map(); // email -> { id, name, email, passwordHash, createdAt }

// Configure Nodemailer Transporter for Hostinger SMTP
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

// Generate random 6-digit verification OTP code
function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// HEALTH CHECK ENDPOINT
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'Earnlio Hostinger SMTP Authentication Server',
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    time: new Date().toISOString(),
  });
});

// 1. REQUEST OTP VERIFICATION CODE (SIGNUP / LOGIN / FORGOT PASSWORD)
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, name, type = 'signup' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const code = generateOtpCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(cleanEmail, {
      code,
      expiresAt,
      type,
      name: name ? name.trim() : 'User',
    });

    const transporter = getTransporter();
    let emailSent = false;
    let smtpError = null;

    if (transporter) {
      const subjectMap = {
        signup: 'Verify Your Email - Earnlio',
        login: 'Login Verification Code - Earnlio',
        forgot_password: 'Password Reset Verification Code - Earnlio',
      };

      const mailOptions = {
        from: process.env.SMTP_FROM || `"Earnlio Rewards" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: subjectMap[type] || 'Verification Code - Earnlio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #f8fafc;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #0F3B3A; margin: 0; font-size: 24px;">Earnlio Rewards</h1>
            </div>
            <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h2 style="color: #10282A; font-size: 18px; margin-top: 0;">Verification Code</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                Hello <strong>${name || cleanEmail}</strong>,
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                Your verification code for <strong>${type.replace('_', ' ')}</strong> is:
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0F3B3A; background-color: #CBF53C; padding: 12px 28px; border-radius: 12px; display: inline-block;">
                  ${code}
                </span>
              </div>
              <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
                This code will expire in 10 minutes. If you did not request this code, please ignore this email.
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 11px;">
              &copy; ${new Date().getFullYear()} Earnlio Rewards. All rights reserved.
            </div>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (err) {
        console.error('SMTP Error:', err);
        smtpError = err.message;
      }
    }

    return res.json({
      success: true,
      message: emailSent
        ? `Verification code sent to ${cleanEmail} via Hostinger SMTP.`
        : `OTP generated for ${cleanEmail}. (SMTP note: ${smtpError || 'No SMTP configured in .env'})`,
      emailSent,
      code, // Included for easy testing if SMTP credentials are pending
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP code.', error: error.message });
  }
});

// 2. VERIFY OTP CODE AND COMPLETE SIGNUP / LOGIN
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, code, name } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const stored = otpStore.get(cleanEmail);

    if (!stored) {
      return res.status(400).json({ success: false, message: 'No code requested for this email or code expired.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    if (stored.code !== cleanCode) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
    }

    // Code verified! Remove code from store
    otpStore.delete(cleanEmail);

    // Save/Update user profile
    let user = userStore.get(cleanEmail);
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        name: name ? name.trim() : stored.name || 'Shoaib Ahmad',
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      };
      userStore.set(cleanEmail, user);
    }

    return res.json({
      success: true,
      message: 'Email successfully verified!',
      user,
      token: `token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification failed.', error: error.message });
  }
});

// 3. FORGOT PASSWORD - REQUEST RESET CODE
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const code = generateOtpCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  otpStore.set(cleanEmail, { code, expiresAt, type: 'forgot_password' });

  const transporter = getTransporter();
  let emailSent = false;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Earnlio Rewards" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: 'Reset Password Verification Code - Earnlio',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 480px; margin: auto;">
            <h2 style="color: #0F3B3A;">Password Reset Request</h2>
            <p>Use the code below to reset your Earnlio account password:</p>
            <h1 style="background: #CBF53C; color: #10282A; display: inline-block; padding: 10px 20px; border-radius: 8px;">${code}</h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      console.error('Reset Password SMTP Error:', err);
    }
  }

  return res.json({
    success: true,
    message: emailSent
      ? `Password reset code sent to ${cleanEmail}.`
      : `Reset code generated: ${code}`,
    code,
  });
});

// 4. RESET PASSWORD WITH VERIFICATION CODE
app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const stored = otpStore.get(cleanEmail);

  if (!stored || stored.type !== 'forgot_password') {
    return res.status(400).json({ success: false, message: 'Invalid or expired password reset request.' });
  }

  if (stored.code !== code.trim()) {
    return res.status(400).json({ success: false, message: 'Incorrect verification code.' });
  }

  otpStore.delete(cleanEmail);

  const user = userStore.get(cleanEmail) || { email: cleanEmail, name: 'User' };
  user.passwordHash = newPassword; // Replace with bcrypt in production
  userStore.set(cleanEmail, user);

  return res.json({
    success: true,
    message: 'Password successfully reset! You can now log in with your new password.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Earnlio Hostinger SMTP Server running on port ${PORT}`);
});
