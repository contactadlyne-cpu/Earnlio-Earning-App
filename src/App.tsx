import React, { useState, useEffect } from 'react';
import {
  ScreenName,
  MainTab,
  BottomNavTab,
  UserProfile,
  WalletState,
  Transaction,
  StreakState,
  Achievement,
  NotificationItem,
  VideoItem,
  ArticleItem,
  EbookItem,
  OfferItem,
  EarningCategoryType,
} from './types';
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { EarnView } from './components/EarnView';
import { ReferralView } from './components/ReferralView';
import { SettingsView } from './components/SettingsView';
import { VideosScreen } from './components/Categories/VideosScreen';
import { ArticlesScreen } from './components/Categories/ArticlesScreen';
import { EbooksScreen } from './components/Categories/EbooksScreen';
import { OffersScreen } from './components/Categories/OffersScreen';
import { OfferDetailsScreen } from './components/Categories/OfferDetailsScreen';
import { AchievementsScreen } from './components/SubScreens/AchievementsScreen';
import { DailyStreakScreen } from './components/SubScreens/DailyStreakScreen';
import { EditProfileScreen } from './components/SubScreens/EditProfileScreen';
import { AddPayoutMethodScreen } from './components/SubScreens/AddPayoutMethodScreen';
import { TransactionsHistoryScreen } from './components/SubScreens/TransactionsHistoryScreen';
import { WalletView } from './components/WalletView';
import { SupportScreen } from './components/SupportScreen';
import { EarnTaskModal } from './components/EarnTaskModal';
import { SuggestionsModal } from './components/SuggestionsModal';
import { AboutUsModal } from './components/AboutUsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SmtpConfigModal } from './components/SmtpConfigModal';
import { Toast } from './components/Toast';
import { WelcomeScreen } from './components/Onboarding/WelcomeScreen';
import { SignUpScreen } from './components/Onboarding/SignUpScreen';
import { LogInScreen } from './components/Onboarding/LogInScreen';
import { ForgotPasswordScreen } from './components/Onboarding/ForgotPasswordScreen';
import { api, MOCK_VIDEOS, MOCK_ARTICLES, MOCK_EBOOKS, MOCK_OFFERS } from './api';

export default function App() {
  // CORE APPLICATION STATE FROM API SERVICE
  const [profile, setProfile] = useState<UserProfile>(api.getUserProfile());
  const [wallet, setWallet] = useState<WalletState>(api.getWallet());
  const [transactions, setTransactions] = useState<Transaction[]>(api.getTransactions());
  const [streak, setStreak] = useState<StreakState>(api.getStreak());
  const [achievements, setAchievements] = useState<Achievement[]>(api.getAchievements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(api.getNotifications());

  // ROUTING & SCREEN STATES
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('main');
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('dashboard');
  const [activeBottomTab, setActiveBottomTab] = useState<BottomNavTab>('home');

  // CATEGORY SELECTIONS
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<EarningCategoryType | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);

  // MODALS & OVERLAYS
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSmtpModal, setShowSmtpModal] = useState(false);

  // TOAST STATE
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // REFRESH ALL DATA FROM API
  const refreshData = () => {
    setProfile(api.getUserProfile());
    setWallet(api.getWallet());
    setTransactions(api.getTransactions());
    setStreak(api.getStreak());
    setAchievements(api.getAchievements());
    setNotifications(api.getNotifications());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // AUTOMATIC SCROLL RESET ON NAVIGATION / ROUTE CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [currentScreen, activeMainTab]);

  // COMBINED USER STATE OBJECT FOR COMPONENTS
  const userState = {
    ...profile,
    ...wallet,
    welcomeTitle: 'Welcome',
    streakFlame: streak.count,
    unlockedCount: achievements.filter((a) => a.unlocked).length,
    totalAchievements: achievements.length,
    progressPercent: Math.min(100, Math.floor((wallet.balanceUsd / wallet.payoutThresholdUsd) * 100)),
    minWithdrawalUsd: wallet.payoutThresholdUsd,
    requiredPoints: wallet.payoutThresholdUsd * 1000,
  };

  const appConfig = {
    minWithdrawalUsd: wallet.payoutThresholdUsd,
    pointsPerUsd: 1000,
    appVersion: '91.9 (110)',
    supportEmail: 'support@earnlio.com',
  };

  // EVENT HANDLERS
  const handleEarnTaskComplete = async (
    category: EarningCategoryType,
    title: string,
    rewardUsd: number,
    rewardPoints: number
  ): Promise<boolean> => {
    const categoryMap: Record<EarningCategoryType, 'Videos' | 'Articles' | 'Ebooks' | 'Offers'> = {
      Videos: 'Videos',
      Articles: 'Articles',
      Ebooks: 'Ebooks',
      Offers: 'Offers',
    };
    const { wallet: nextWallet, transactions: nextTxs } = await api.creditReward(
      categoryMap[category],
      title,
      rewardUsd,
      rewardPoints
    );
    setWallet(nextWallet);
    setTransactions(nextTxs);
    refreshData();
    showToast(`+$${rewardUsd.toFixed(2)} credited!`);
    return true;
  };

  const handleWatchVideo = async (video: VideoItem) => {
    await handleEarnTaskComplete('Videos', `Watched ${video.title}`, video.rewardUsd, video.points);
  };

  const handleFinishArticle = async (article: ArticleItem) => {
    await handleEarnTaskComplete('Articles', `Finished ${article.title}`, article.rewardUsd, article.points);
  };

  const handleFinishEbook = async (book: EbookItem) => {
    await handleEarnTaskComplete('Ebooks', `Read ${book.title}`, 0.015, 15);
  };

  const handleCompleteOffer = async (offer: OfferItem) => {
    await handleEarnTaskComplete('Offers', offer.title, offer.rewardUsd, offer.points);
  };

  const handleApplyReferralCode = async (code: string): Promise<boolean> => {
    const res = api.claimFriendCode(code);
    if (res.success) {
      refreshData();
      showToast(res.message);
      return true;
    }
    return false;
  };

  const handleWithdrawSubmit = async (method: string, amount: number): Promise<boolean> => {
    const res = await api.submitWithdrawal(amount, method);
    if (res.success) {
      setWallet(res.wallet);
      setTransactions(res.transactions);
      refreshData();
      showToast(`Withdrawal of $${amount.toFixed(2)} submitted!`);
      return true;
    }
    return false;
  };

  const handleAddPayoutMethod = (type: 'paypal' | 'bank' | 'gift_card', detail: string) => {
    const updatedWallet = api.addPayoutMethod(type, detail);
    setWallet(updatedWallet);
    showToast('Payout method saved!');
  };

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    const next = api.updateUserProfile(updated);
    setProfile(next);
    showToast('Profile updated!');
  };

  const handleSubmitSuggestion = async (text: string): Promise<boolean> => {
    showToast('Feedback submitted! Thank you.');
    return true;
  };

  const handleMarkNotificationsRead = () => {
    api.markNotificationsRead();
    setNotifications(api.getNotifications());
    showToast('All notifications marked as read');
  };

  const handleMarkSingleNotificationRead = (id: string) => {
    api.markNotificationRead(id);
    setNotifications(api.getNotifications());
  };

  const handleClaimStreakBonus = async () => {
    const res = api.claimDailyStreak();
    refreshData();
    showToast(res.message);
  };

  const handleClaimStreakMilestone = async (milestoneDays: number, rewardUsd: number, points: number) => {
    const res = api.claimStreakMilestone(milestoneDays, rewardUsd, points);
    refreshData();
    showToast(res.message);
  };

  const handleGoogleLogin = () => {
    api.loginWithGoogle('contactadlyne@gmail.com', 'Shoaib Ahmad');
    refreshData();
    setCurrentScreen('main');
    showToast('Signed in with Google! Welcome back.');
  };

  const handleGuestLogin = () => {
    api.loginAsGuest();
    refreshData();
    setCurrentScreen('main');
    showToast('Entered as Guest Explorer! You can earn & test features.');
  };

  const handleLogout = () => {
    api.logout();
    refreshData();
    setCurrentScreen('welcome');
    showToast('Logged out successfully');
  };

  // CATEGORY CLICK DIRECT ROUTING
  const handleSelectCategory = (cat: EarningCategoryType) => {
    if (cat === 'Videos') setCurrentScreen('videos');
    else if (cat === 'Articles') setCurrentScreen('articles');
    else if (cat === 'Ebooks') setCurrentScreen('ebooks');
    else if (cat === 'Offers') setCurrentScreen('offers');
    else setSelectedTaskCategory(cat);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F4F6F1] w-full flex flex-col items-center font-sans text-[#10282A] antialiased">
      {/* TOAST NOTIFICATION */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* MAIN RESPONSIVE PHONE CONTAINER */}
      <main className="w-full max-w-md min-h-screen bg-[#F4F6F1] flex flex-col relative mx-auto shadow-none sm:shadow-md border-x-0 sm:border-x sm:border-slate-200/60">
        {/* TOP HEADER (ONLY SHOWN ON MAIN TAB SCREENS) */}
        {currentScreen === 'main' && (
          <Header
            user={userState}
            unreadNotificationsCount={unreadNotifsCount}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            onOpenStreak={() => setCurrentScreen('daily_streak')}
            onOpenProfile={() => setCurrentScreen('edit_profile')}
          />
        )}

        {/* TOP TAB NAVIGATION (ONLY SHOWN ON MAIN TABS) */}
        {currentScreen === 'main' && (
          <TopNav
            activeTab={activeMainTab}
            onSelectTab={(tab) => {
              setActiveMainTab(tab);
              if (tab === 'earn') setActiveBottomTab('earn');
              else if (tab === 'settings') setActiveBottomTab('settings');
              else setActiveBottomTab('home');
            }}
          />
        )}

        {/* DYNAMIC SCREEN ROUTER */}
        <div className="flex-1 w-full relative">
          {currentScreen === 'welcome' ? (
            <WelcomeScreen
              onGoogleLogin={handleGoogleLogin}
              onGuestLogin={handleGuestLogin}
            />
          ) : currentScreen === 'signup' ? (
            <SignUpScreen
              onBack={() => setCurrentScreen('welcome')}
              onSignUpSuccess={(_name, _email) => {
                handleGoogleLogin();
              }}
              onGoToLogin={() => setCurrentScreen('login')}
              onGuestLogin={handleGuestLogin}
              onShowToast={showToast}
            />
          ) : currentScreen === 'login' ? (
            <LogInScreen
              onBack={() => setCurrentScreen('welcome')}
              onLoginSuccess={(_email) => {
                handleGoogleLogin();
              }}
              onGoToSignUp={() => setCurrentScreen('signup')}
              onGuestLogin={handleGuestLogin}
              onShowToast={showToast}
            />
          ) : currentScreen === 'forgot_password' ? (
            <LogInScreen
              onBack={() => setCurrentScreen('welcome')}
              onLoginSuccess={(_email) => {
                handleGoogleLogin();
              }}
              onGoToSignUp={() => setCurrentScreen('signup')}
              onGuestLogin={handleGuestLogin}
              onShowToast={showToast}
            />
          ) : currentScreen === 'videos' ? (
            <VideosScreen
              videos={MOCK_VIDEOS}
              onBack={() => setCurrentScreen('main')}
              onWatchVideo={handleWatchVideo}
            />
          ) : currentScreen === 'articles' ? (
            <ArticlesScreen
              articles={MOCK_ARTICLES}
              onBack={() => setCurrentScreen('main')}
              onFinishArticle={handleFinishArticle}
            />
          ) : currentScreen === 'ebooks' ? (
            <EbooksScreen
              ebooks={MOCK_EBOOKS}
              onBack={() => setCurrentScreen('main')}
              onFinishEbook={handleFinishEbook}
            />
          ) : currentScreen === 'offers' ? (
            <OffersScreen
              offers={MOCK_OFFERS}
              onBack={() => setCurrentScreen('main')}
              onSelectOffer={(offer) => {
                setSelectedOffer(offer);
                setCurrentScreen('offer_details');
              }}
            />
          ) : currentScreen === 'offer_details' && selectedOffer ? (
            <OfferDetailsScreen
              offer={selectedOffer}
              onBack={() => setCurrentScreen('offers')}
              onCompleteOffer={handleCompleteOffer}
            />
          ) : currentScreen === 'achievements' ? (
            <AchievementsScreen
              achievements={achievements}
              onBack={() => setCurrentScreen('main')}
            />
          ) : currentScreen === 'daily_streak' ? (
            <DailyStreakScreen
              streak={streak}
              onBack={() => setCurrentScreen('main')}
              onClaimStreak={handleClaimStreakBonus}
              onClaimMilestone={handleClaimStreakMilestone}
            />
          ) : currentScreen === 'edit_profile' ? (
            <EditProfileScreen
              user={profile}
              onBack={() => setCurrentScreen('main')}
              onSave={handleSaveProfile}
            />
          ) : currentScreen === 'add_payout_method' ? (
            <AddPayoutMethodScreen
              onBack={() => setCurrentScreen('withdraw')}
              onSaveMethod={handleAddPayoutMethod}
            />
          ) : currentScreen === 'withdraw' ? (
            <WalletView
              user={userState}
              config={appConfig}
              onBack={() => setCurrentScreen('main')}
              onWithdrawSubmit={handleWithdrawSubmit}
            />
          ) : currentScreen === 'transactions_history' ? (
            <TransactionsHistoryScreen
              transactions={transactions}
              onBack={() => setCurrentScreen('main')}
              onOpenNotifications={() => setShowNotificationsModal(true)}
              unreadNotificationsCount={unreadNotifsCount}
            />
          ) : currentScreen === 'support_help' ? (
            <SupportScreen
              user={userState}
              config={appConfig}
              onBack={() => setCurrentScreen('main')}
            />
          ) : (
            /* MAIN TABS */
            <>
              {activeMainTab === 'dashboard' && (
                <DashboardView
                  user={userState}
                  config={appConfig}
                  transactions={transactions}
                  onSelectCategory={handleSelectCategory}
                  onOpenWallet={() => setCurrentScreen('withdraw')}
                  onOpenTransactionsHistory={() => setCurrentScreen('transactions_history')}
                />
              )}
              {activeMainTab === 'earn' && (
                <EarnView
                  config={appConfig}
                  onSelectCategory={handleSelectCategory}
                />
              )}
              {activeMainTab === 'referral' && (
                <ReferralView
                  user={userState}
                  onApplyReferralCode={handleApplyReferralCode}
                />
              )}
              {activeMainTab === 'settings' && (
                <SettingsView
                  user={userState}
                  config={appConfig}
                  transactions={transactions}
                  onUpdateUserSettings={handleSaveProfile}
                  onOpenSuggestionModal={() => setShowSuggestionsModal(true)}
                  onOpenAboutUsModal={() => setShowAboutUsModal(true)}
                  onOpenSupportScreen={() => setCurrentScreen('support_help')}
                  onOpenWallet={() => setCurrentScreen('withdraw')}
                  onOpenAchievements={() => setCurrentScreen('achievements')}
                  onOpenEditProfile={() => setCurrentScreen('edit_profile')}
                  onOpenSmtpConfig={() => setShowSmtpModal(true)}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </div>

        {/* FLOATING BOTTOM NAV (HIDDEN ON ONBOARDING SCREENS) */}
        {currentScreen !== 'welcome' &&
          currentScreen !== 'signup' &&
          currentScreen !== 'login' &&
          currentScreen !== 'forgot_password' && (
            <BottomNav
              activeTab={
                currentScreen === 'main'
                  ? activeMainTab === 'earn'
                    ? 'earn'
                    : activeMainTab === 'settings'
                    ? 'settings'
                    : 'home'
                  : activeBottomTab
              }
              onSelectTab={(tab) => {
                setCurrentScreen('main');
                setActiveBottomTab(tab);
                if (tab === 'home') setActiveMainTab('dashboard');
                else if (tab === 'earn') setActiveMainTab('earn');
                else if (tab === 'settings') setActiveMainTab('settings');
              }}
            />
          )}
      </main>

      {/* MODALS */}
      <EarnTaskModal
        category={selectedTaskCategory}
        onClose={() => setSelectedTaskCategory(null)}
        onCompleteTask={handleEarnTaskComplete}
      />

      <SuggestionsModal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        onSubmitSuggestion={handleSubmitSuggestion}
      />

      <AboutUsModal
        isOpen={showAboutUsModal}
        onClose={() => setShowAboutUsModal(false)}
      />

      <NotificationsModal
        isOpen={showNotificationsModal}
        notifications={notifications}
        onClose={() => setShowNotificationsModal(false)}
        onMarkAllAsRead={handleMarkNotificationsRead}
        onMarkSingleAsRead={handleMarkSingleNotificationRead}
      />

      <SmtpConfigModal
        isOpen={showSmtpModal}
        onClose={() => setShowSmtpModal(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
