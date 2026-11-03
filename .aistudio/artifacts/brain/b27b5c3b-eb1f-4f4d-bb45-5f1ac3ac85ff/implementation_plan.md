# Earnlio: Mobile-First Responsive Overhaul & Interactive Earning Experience

A production-grade mobile web rewards experience with true fluid responsiveness across all smartphone viewports (375px to 430px+) and interactive simulation flows for the four confirmed earning activities (Videos, Articles, eBooks, Offers).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1:
> - **Mobile Viewport Geometry**: Full fluid width (`100%`) on all native mobile screens with fluid padding and safe-area insets, centered as an elegant mobile app canvas on desktop viewports.
> - **Feature Overhaul Order**: Phase 1 focuses on the **Earning Categories** (Videos with simulated video player, Articles with in-depth reader & scroll completion, eBooks with interactive chapter pagination & live per-minute timers, and Offers with multi-step interactive task modals). Subsequent phases address Wallet/Cashouts, Referral Sharing, and Settings/Badges.
> - **Earning Mechanics**: Engaging interactive simulations with live counters, progress bars, and reward claim animations that persist directly into the `api.ts` local state engine.

---

### 1. Overview & Core Concept

- **What It Does**: Earnlio lets users earn real reward points (1000 points = $1.00 USD) through four distinct micro-activities (Videos, Articles, eBooks, Offers), track progress toward a minimum $10.00 cashout threshold, refer friends, and redeem via PayPal, Bank transfer, or Gift cards.
- **Target Audience**: Everyday mobile users seeking micro-earning opportunities during commutes or downtime on their smartphones.
- **Key Value**: Transparent conversion rate ($1.00 per 1,000 points), zero spam or scam categories (no surveys, games, or courses), and immediate, tangible feedback for every completed minute of reading or video watched.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Fluid Responsive Shell Navigation**: Users open Earnlio on any mobile device (from 375px iPhone SE to 430px iPhone Pro Max, foldables, or Android devices). The layout fills the device width seamlessly without horizontal scrollbars or forced device bezels on mobile, while centering neatly on tablet/desktop displays.
2. **Interactive Video Clip Flow**: User selects a video clip from the Videos category, watches a full simulated stream player with live countdown progress, sees real-time buffering and playback feedback, and claims instant cash + points once completed.
3. **Article Reader Flow**: User chooses an article, reads through editorial prose with responsive typography and word count tracking, scrolls to the bottom to verify completion, and claims instant article rewards.
4. **eBook Chapter & Per-Minute Reading Flow**: User opens a book in the eBook Reader, navigates chapters, sees an active 60-second reading timer with progress visualization, and automatically earns continuous points for every minute spent actively reading.
5. **Multi-Step Offer Quest Flow**: User inspects high-value offers with clear step-by-step checklists, completes task steps interactively, and claims one-time reward payouts.

#### Visual Identity & Theme
- **Color Discipline**:
  - Dominant Canvas (60%): `#F4F6F1` (warm off-white/light sage) with crisp white `#FFFFFF` cards.
  - Structural Surfaces (30%): Dark Teal `#0F3B3A` for headers, balance hero cards, and bottom navigation; soft pastel tints (`#BFE9E3`, `#FFD9B8`, `#E2DAFF`, `#CBF53C`) for category identifiers.
  - Accent Energy (10%): Sharp Lime `#CBF53C` for primary call-to-actions, active navigation pills, and streak badges.
  - Semantic Status: Forest Green `#0B6B3A` on `#E3F6DF` for credited earnings; Crimson `#B3261E` on `#FDE8E8` for errors or alerts.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` (weights 700 and 800) for energetic, modern headlines.
  - Body & Micro-prose: `Plus Jakarta Sans` (weights 500 and 600) with generous line heights (1.55) and balanced text wrapping.
  - Tabular Numerals: Tabular figures (`tabular-nums`) across all points, dollar amounts, timers, and balances.
- **Zero-Pill Anti-Slop Discipline**:
  - Metadata (read times, durations, dates, categories) rendered as quiet unboxed text separated by typographic middots (`·`).
  - Pills and capsules reserved exclusively for clickable interactive button controls (tabs, filter pills, and bottom navigation).

#### Interactive Feedback & Motion
- Fast, tactile response ($\le 180\text{ms}$) on all touch controls with subtle `active:scale-[0.98]` feedback.
- Floating bottom tab bar respects mobile safe-area insets (`env(safe-area-inset-bottom)`) and stays under the 15% viewport height cap.
- Toast notifications appear smoothly with automatic 3-second self-dismissal upon crediting earnings.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Mobile-First Responsive Breakpoints**
  - *Chosen Approach*: Replace hardcoded fixed-pixel container constraints with a fluid layout: `w-full min-h-screen sm:max-w-md sm:my-4 sm:rounded-[36px] sm:shadow-2xl mx-auto`. On screens $< 640\text{px}$, the app expands to 100% viewport width with edge-to-edge content and internal 16px horizontal padding.
  - *Why*: Eliminates awkward side gutters, double borders, or cutoffs on native phone screens while providing a clean mobile simulator frame on desktop.
- **Decision 2: Interactive Earning Experience Depth**
  - *Chosen Approach*: Deliver realistic interactive simulators for each category rather than static instant click-to-earn buttons.
  - *Why*: Gives users authentic tactile satisfaction, prevents feeling like a fake clicker, and accurately reflects how rewards apps function.
- **Decision 3: Single-Source State Persistence (`api.ts`)**
  - *Chosen Approach*: Maintain all wallet balances, transactions, streak days, notifications, and completed tasks in a single centralized `localStorage` service layer.
  - *Why*: Ensures state changes in category screens instantly reflect across the Dashboard, Wallet, Header points pill, and Earnings history without page reloads.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Earnlio Web App                                 │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         StatusBar (Android)                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │         Header (Avatar, Welcome, Streak Flame, Notification Bell)   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │              TopNav Tabs: Dashboard · Earn · Referral · Settings    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                           Screen Router                             │   │
│   │                                                                     │   │
│   │   [ Dashboard View ]   [ Earn View ]   [ Referral View ]            │   │
│   │           │                  │                                      │   │
│   │           ▼                  ▼                                      │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │ Category Screens (Simulations, Timers, Reward Claiming)     │   │   │
│   │   │  • VideosScreen: Live stream simulation, buffer & timer     │   │   │
│   │   │  • ArticlesScreen: Read time tracker, completion trigger    │   │   │
│   │   │  • EbooksScreen: Chapter reader, 60s live reading timer     │   │   │
│   │   │  • OffersScreen: Multi-step quest details & claim action    │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │           │                                                         │   │
│   │           ▼                                                         │   │
│   │   [ SubScreens: Achievements · Streak · Profile · Withdraw/Wallet ] │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Floating BottomNav Bar                          │   │
│   │                     [ Home · Earn · Settings ]                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                  Service Layer (src/api.ts)                         │   │
│   │      WalletState · Transactions · UserProfile · Streak · Badges     │   │
│   │                    (Backed by localStorage)                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Implementation Roadmap
1. **Layout & Responsiveness Overhaul**:
   - Refactor `src/App.tsx` and main layout wrappers so mobile viewports ($< 640\text{px}$) use pure `w-full min-h-screen` fluid layouts without rigid `390px` clipping.
   - Add viewport safe-area handling (`pb-safe`) for the floating bottom navigation bar.
2. **Videos Screen & Interactive Player Overhaul**:
   - Enhance `VideosScreen.tsx` with realistic playback states (play/pause, buffering indicator, live second-by-second progress countdown).
   - Add celebratory claim modal with confetti and immediate balance crediting.
3. **Articles Screen & Reader View**:
   - Upgrade `ArticlesScreen.tsx` with dedicated full-screen article reader mode containing authentic editorial content, estimated read time badges, scroll progress tracker, and completion claim trigger.
4. **eBooks Screen & Live Reading Timer**:
   - Enhance `EbooksScreen.tsx` and eBook Reader with chapter selector, font size / reading mode toggles, and seamless continuous 60-second reward accumulation.
5. **Offers Screen & Quest Details**:
   - Upgrade `OffersScreen.tsx` and `OfferDetailsScreen.tsx` with interactive step checklist toggles, progress indicator, and claim flow.
6. **Wallet & Payout Polish**:
   - Verify threshold enforcement ($10.00 / 10,000 points minimum) across the withdrawal screen and dashboard progress bars.
7. **Verification**:
   - Run compilation and lint validation to guarantee zero TypeScript or build errors.
