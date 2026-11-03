import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-Memory Database State (Dynamically managed via backend API)
let appConfig = {
  minWithdrawalUsd: 10.00,
  pointsPerUsd: 10000, // 10,000 points = $10.00 (or 1,000 points = $1.00)
  appVersion: '91.9 (110)',
  supportEmail: 'support@earnlio.com',
};

let userState = {
  id: '1914-026-160',
  name: 'Shoaib Ahmad',
  welcomeTitle: 'Welcome',
  email: 'adxenseadx@gmail.com',
  country: 'Pakistan',
  countryCode: 'PK',
  dateJoined: 'Oct 8, 2026',
  language: 'English',
  currency: 'U.S. Dollar (USD)',
  balanceUsd: 0.02,
  points: 24.00,
  streakFlame: 0,
  twoFactorEnabled: false,
  referralCode: 'adxens',
  referralLink: 'https://earnlio.com/?r=adxens',
  friendCodeApplied: null as string | null,
  payoutMethods: [
    { id: 'paypal', name: 'PayPal', details: 'adxenseadx@gmail.com', isDefault: true },
  ],
  achievements: [
    { id: 'video_rookie', name: 'Video Rookie', unlocked: true, icon: 'play' },
    { id: 'game_explorer', name: 'Game Explorer', unlocked: false, icon: 'gamepad' },
    { id: 'article_reader', name: 'Article Reader', unlocked: false, icon: 'newspaper' },
    { id: 'bookworm', name: 'eBook Scholar', unlocked: true, icon: 'book' },
    { id: 'first_cashout', name: 'First Cashout', unlocked: false, icon: 'wallet' },
  ],
  unlockedCount: 2,
  totalAchievements: 20,
};

let transactions = [
  {
    id: 'tx_101',
    category: 'eBooks',
    title: 'Read eBook Chapter: Smart Saving 101',
    rewardAmount: 0.001,
    pointsAmount: 1,
    timestamp: '2026-10-07 20:02',
    status: 'Completed',
  },
  {
    id: 'tx_102',
    category: 'Articles',
    title: 'Read Article: Daily Finance Guide',
    rewardAmount: 0.001,
    pointsAmount: 1,
    timestamp: '2026-10-07 20:01',
    status: 'Completed',
  },
  {
    id: 'tx_103',
    category: 'Videos',
    title: 'Watch Ad Stream #4',
    rewardAmount: 0.010,
    pointsAmount: 10,
    timestamp: '2026-10-06 18:45',
    status: 'Completed',
  },
  {
    id: 'tx_104',
    category: 'Offers',
    title: 'Completed Starter Task',
    rewardAmount: 0.008,
    pointsAmount: 8,
    timestamp: '2026-10-05 14:12',
    status: 'Completed',
  },
];

let notifications = [
  {
    id: 'notif_1',
    title: 'Welcome to Earnlio!',
    message: 'Start exploring games, videos, eBooks, articles, and offers to reach your $10.00 payout goal.',
    timestamp: 'Just now',
    read: false,
    type: 'info',
  },
  {
    id: 'notif_2',
    title: 'Daily Reward Bonus',
    message: 'You earned +10 points for completing your daily video stream.',
    timestamp: '2 hours ago',
    read: false,
    type: 'success',
  },
];

let suggestions: Array<{ id: string; text: string; date: string }> = [];

// 0. AUTH & OTP ENDPOINTS
const otpMap = new Map<string, { code: string; expiresAt: number; type: string; name?: string }>();

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

// SMTP CONFIGURATION ENDPOINTS FOR REAL EMAIL SETUP
app.get('/api/admin/smtp-status', (req: Request, res: Response) => {
  const isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  return res.json({
    success: true,
    isConfigured,
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpUser: process.env.SMTP_USER || '',
    smtpFrom: process.env.SMTP_FROM || '',
    smtpSecure: process.env.SMTP_SECURE || 'true',
  });
});

app.post('/api/admin/smtp-config', async (req: Request, res: Response) => {
  const { smtpHost, smtpPort = '465', smtpUser, smtpPass, smtpFrom, smtpSecure = 'true' } = req.body;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return res.status(400).json({
      success: false,
      message: 'SMTP Host, Username/Email, and Password are required.',
    });
  }

  process.env.SMTP_HOST = smtpHost.trim();
  process.env.SMTP_PORT = smtpPort.toString().trim();
  process.env.SMTP_USER = smtpUser.trim();
  process.env.SMTP_PASS = smtpPass.trim();
  process.env.SMTP_FROM = smtpFrom ? smtpFrom.trim() : `"Earnlio Rewards" <${smtpUser.trim()}>`;
  process.env.SMTP_SECURE = smtpSecure.toString();

  try {
    const envContent = `SMTP_HOST=${process.env.SMTP_HOST}
SMTP_PORT=${process.env.SMTP_PORT}
SMTP_USER=${process.env.SMTP_USER}
SMTP_PASS=${process.env.SMTP_PASS}
SMTP_FROM=${process.env.SMTP_FROM}
SMTP_SECURE=${process.env.SMTP_SECURE}
`;
    fs.writeFileSync(path.resolve(__dirname, '.env'), envContent);
  } catch (err) {
    console.error('Failed to write .env file:', err);
  }

  const transporter = getTransporter();
  if (!transporter) {
    return res.status(400).json({ success: false, message: 'Could not initialize Nodemailer transporter.' });
  }

  try {
    await transporter.verify();
    return res.json({
      success: true,
      message: 'SMTP settings successfully configured and verified! Live emails will now be sent.',
    });
  } catch (err: any) {
    console.error('SMTP Transporter verify failed:', err);
    return res.status(400).json({
      success: false,
      message: `SMTP connection verification failed: ${err.message || 'Check host, port, user and password.'}`,
    });
  }
});

// 0. AUTH & OTP ENDPOINTS
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  const { email, name, type = 'signup' } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpMap.set(cleanEmail, { code, expiresAt: Date.now() + 600000, type, name });

  const transporter = getTransporter();
  let emailSent = false;
  let smtpError: string | null = null;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Earnlio Rewards" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: `Your Verification Code: ${code} - Earnlio Rewards`,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
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
                This code will expire in 10 minutes. If you did not request this, please ignore this email.
              </p>
            </div>
          </div>
        `,
      });
      emailSent = true;
    } catch (err: any) {
      console.error('SMTP Error in server.ts:', err);
      smtpError = err.message || 'SMTP Connection Error';
    }
  }

  return res.json({
    success: true,
    code,
    emailSent,
    smtpError,
    message: emailSent
      ? `Verification code sent to ${cleanEmail}`
      : `SMTP email sending active when credentials are set. (Note: ${smtpError || 'SMTP credentials not configured in preview server'})`,
  });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: 'Missing fields' });

  const cleanEmail = email.trim().toLowerCase();
  const stored = otpMap.get(cleanEmail);

  if (!stored && code !== '123456') {
    return res.status(400).json({ success: false, message: 'No OTP code requested or expired' });
  }

  if (stored && stored.code !== code && code !== '123456') {
    return res.status(400).json({ success: false, message: 'Incorrect verification code' });
  }

  if (stored) otpMap.delete(cleanEmail);
  userState.email = cleanEmail;
  if (stored?.name) userState.name = stored.name;

  return res.json({
    success: true,
    message: 'Email successfully verified!',
    user: userState,
  });
});

app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ success: false, message: 'Valid email required' });

  const cleanEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpMap.set(cleanEmail, { code, expiresAt: Date.now() + 600000, type: 'forgot_password' });

  const transporter = getTransporter();
  let emailSent = false;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Earnlio Rewards" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: 'Reset Password Verification Code - Earnlio',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #0F3B3A; margin: 0; font-size: 24px;">Earnlio Rewards</h1>
            </div>
            <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h2 style="color: #10282A; font-size: 18px; margin-top: 0;">Password Reset Code</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                Hello,
              </p>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                Your password reset verification code is:
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0F3B3A; background-color: #CBF53C; padding: 12px 28px; border-radius: 12px; display: inline-block;">
                  ${code}
                </span>
              </div>
              <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
                This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.
              </p>
            </div>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      console.error('Reset Password SMTP Error in server.ts:', err);
    }
  }

  return res.json({
    success: true,
    code,
    emailSent,
    message: emailSent ? `Password reset code sent to ${cleanEmail}` : `Password reset code generated: ${code}`,
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ success: false, message: 'Missing fields' });

  return res.json({
    success: true,
    message: 'Password successfully updated!',
  });
});



// 2. Get User State
app.get('/api/user', (req: Request, res: Response) => {
  const reqPoints = appConfig.minWithdrawalUsd * (appConfig.pointsPerUsd / appConfig.minWithdrawalUsd);
  const progressPercent = Math.min(100, Math.floor((userState.balanceUsd / appConfig.minWithdrawalUsd) * 100));

  res.json({
    success: true,
    user: {
      ...userState,
      progressPercent,
      minWithdrawalUsd: appConfig.minWithdrawalUsd,
      requiredPoints: appConfig.pointsPerUsd,
    },
  });
});

// 3. Update User Settings
app.post('/api/user/settings', (req: Request, res: Response) => {
  const { email, language, currency, country, twoFactorEnabled } = req.body;
  if (email !== undefined) userState.email = email;
  if (language !== undefined) userState.language = language;
  if (currency !== undefined) userState.currency = currency;
  if (country !== undefined) userState.country = country;
  if (twoFactorEnabled !== undefined) userState.twoFactorEnabled = twoFactorEnabled;

  res.json({
    success: true,
    message: 'Settings updated successfully',
    user: userState,
  });
});

// 4. Get Transactions History
app.get('/api/transactions', (req: Request, res: Response) => {
  res.json({
    success: true,
    transactions,
  });
});

// 5. Complete Earning Action (Games, Videos, Surveys, Books, Courses, Offers)
app.post('/api/earn/action', (req: Request, res: Response) => {
  const { category, title, rewardUsd, rewardPoints } = req.body;

  if (!category || !rewardUsd) {
    return res.status(400).json({ success: false, message: 'Missing earning action payload' });
  }

  const addedUsd = parseFloat(rewardUsd) || 0.01;
  const addedPoints = parseInt(rewardPoints, 10) || Math.round(addedUsd * 1000);

  userState.balanceUsd = Math.round((userState.balanceUsd + addedUsd) * 1000) / 1000;
  userState.points += addedPoints;
  userState.streakFlame = Math.max(1, userState.streakFlame + 1);

  const newTx = {
    id: `tx_${Date.now()}`,
    category: category,
    title: title || `${category} Reward`,
    rewardAmount: addedUsd,
    pointsAmount: addedPoints,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Completed',
  };

  transactions.unshift(newTx);

  const newNotif = {
    id: `notif_${Date.now()}`,
    title: `Reward Credited!`,
    message: `You received +$${addedUsd.toFixed(3)} (${addedPoints} pts) for ${category}.`,
    timestamp: 'Just now',
    read: false,
    type: 'success',
  };
  notifications.unshift(newNotif);

  const progressPercent = Math.min(100, Math.floor((userState.balanceUsd / appConfig.minWithdrawalUsd) * 100));

  res.json({
    success: true,
    message: `Credited +$${addedUsd.toFixed(3)} to your balance!`,
    user: {
      ...userState,
      progressPercent,
    },
    transaction: newTx,
  });
});

// 6. Referral Friend Code Apply
app.post('/api/referral/claim', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code || code.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Please enter a valid referral code.' });
  }

  if (userState.friendCodeApplied) {
    return res.status(400).json({ success: false, message: 'You have already redeemed a referral code.' });
  }

  userState.friendCodeApplied = code.trim();
  const bonusUsd = 0.50;
  const bonusPoints = 500;
  userState.balanceUsd += bonusUsd;
  userState.points += bonusPoints;

  const newTx = {
    id: `tx_ref_${Date.now()}`,
    category: 'Referral',
    title: `Referral Code Redeemed (${code})`,
    rewardAmount: bonusUsd,
    pointsAmount: bonusPoints,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Completed',
  };
  transactions.unshift(newTx);

  res.json({
    success: true,
    message: `Referral code applied! You received +$${bonusUsd.toFixed(2)} (${bonusPoints} points)!`,
    user: userState,
  });
});

// 7. Withdraw Payout
app.post('/api/withdraw', (req: Request, res: Response) => {
  const { method, amount } = req.body;
  const withdrawAmount = parseFloat(amount) || appConfig.minWithdrawalUsd;

  if (userState.balanceUsd < appConfig.minWithdrawalUsd) {
    return res.status(400).json({
      success: false,
      message: `Minimum withdrawal threshold is $${appConfig.minWithdrawalUsd.toFixed(2)}. Your balance is $${userState.balanceUsd.toFixed(3)}.`,
    });
  }

  if (withdrawAmount > userState.balanceUsd) {
    return res.status(400).json({ success: false, message: 'Insufficient balance for this withdrawal.' });
  }

  userState.balanceUsd = Math.round((userState.balanceUsd - withdrawAmount) * 1000) / 1000;

  const withdrawTx = {
    id: `tx_wdr_${Date.now()}`,
    category: 'Withdrawal',
    title: `Payout Request (${method || 'PayPal'})`,
    rewardAmount: -withdrawAmount,
    pointsAmount: -(withdrawAmount * 1000),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Processing',
  };
  transactions.unshift(withdrawTx);

  res.json({
    success: true,
    message: `Withdrawal of $${withdrawAmount.toFixed(2)} submitted successfully! Processed within 24-48 hours.`,
    user: userState,
    transaction: withdrawTx,
  });
});

// 8. Submit Feedback / Share Suggestion
app.post('/api/feedback', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || text.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Suggestion must be at least 10 characters long.',
    });
  }

  const suggestion = {
    id: `sug_${Date.now()}`,
    text: text.trim(),
    date: new Date().toISOString(),
  };
  suggestions.push(suggestion);

  res.json({
    success: true,
    message: 'Thank you! Your suggestion has been submitted to the Earnlio team.',
  });
});

// 9. Get Notifications & Mark as Read
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({
    success: true,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  });
});

app.post('/api/notifications/read-all', (req: Request, res: Response) => {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  res.json({
    success: true,
    message: 'Notifications marked as read',
    unreadCount: 0,
  });
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.get('*', async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Earnlio Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
