export type ScreenName =
  | 'welcome'
  | 'signup'
  | 'login'
  | 'forgot_password'
  | 'main' // Dashboard, Earn, Referral, Settings
  | 'videos'
  | 'articles'
  | 'ebooks'
  | 'ebook_reader'
  | 'offers'
  | 'offer_details'
  | 'achievements'
  | 'notifications'
  | 'daily_streak'
  | 'add_payout_method'
  | 'withdraw'
  | 'transactions_history'
  | 'edit_profile'
  | 'report_problem'
  | 'support_help';

export type MainTab = 'dashboard' | 'earn' | 'referral' | 'settings';
export type TopTab = MainTab;
export type SettingsSubTab = 'account' | 'payment';
export type BottomNavTab = 'home' | 'earn' | 'settings';
export type BottomTab = BottomNavTab;
export type EarningCategoryType = 'Videos' | 'Articles' | 'Ebooks' | 'Offers';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  language: string;
  currency: string;
  dateJoined: string;
  avatarLetter: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  promoEmailsEnabled: boolean;
  referralCode: string;
  referralLink: string;
  friendCodeApplied?: string | null;
  countryCode?: string;
}

export interface WalletState {
  balanceUsd: number;
  points: number; // 1000 points = $1.00
  payoutThresholdUsd: number; // $10.00
  payoutMethods: PayoutMethod[];
}

export interface UserState extends UserProfile, WalletState {
  welcomeTitle?: string;
  streakFlame?: number;
  unlockedCount?: number;
  totalAchievements?: number;
  progressPercent?: number;
  minWithdrawalUsd?: number;
  requiredPoints?: number;
}

export interface AppConfig {
  minWithdrawalUsd: number;
  pointsPerUsd: number;
  appVersion: string;
  supportEmail: string;
}

export interface PayoutMethod {
  id: string;
  type: 'paypal' | 'bank' | 'gift_card';
  title: string;
  subtitle?: string;
  accountDetail: string;
  details?: string;
  name?: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  category: 'Videos' | 'Articles' | 'Ebooks' | 'Offers' | 'Referral' | 'Streak' | 'Withdrawal' | string;
  title: string;
  timestamp: string;
  amountUsd: number;
  points: number;
  rewardAmount?: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface StreakState {
  count: number;
  lastClaimedDate?: string;
  claimedMilestones?: number[];
  weekActivity: { day: string; active: boolean }[];
}

export interface Achievement {
  id: string;
  title: string;
  unlocked: boolean;
  iconType: 'video' | 'article' | 'offer' | 'book' | 'wallet' | 'flame' | 'star' | 'trophy' | 'clock';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'welcome' | 'streak' | 'achievement' | 'payout' | 'offer';
}

export interface VideoItem {
  id: string;
  title: string;
  durationText: string;
  durationSeconds: number;
  rewardUsd: number;
  points: number;
  videoUrl?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  readTimeText: string;
  rewardUsd: number;
  points: number;
  content: string;
}

export interface EbookItem {
  id: string;
  title: string;
  genre: string;
  timeLeftText: string;
  progressPercent: number;
  tintColor: string; // '#BFE9E3' | '#FFD9B8' | '#E2DAFF' | '#CBF53C'
  content: string[];
}

export interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  rewardUsd: number;
  points: number;
  tintColor: string;
  steps: string[];
  estimatedTime: string;
}
