# Emotion Translator

A production-ready emotion translation and coaching app built with Next.js 15, ToughTongue AI, Firebase Authentication, and TypeScript. Designed to help alexithymic individuals understand, identify, and express their emotions through AI-powered support.

🚀 **[Live Demo](https://alexi-aid.vercel.app/)**

## ✨ Features

### Core Features
- **🧠 Emotion Awareness Assessment**: Interactive AI-powered assessment to build emotional recognition skills
- **💬 Emotion Coach**: AI coach providing personalized guidance on understanding and expressing emotions
- **📔 Emotion Journal**: Track daily emotions, thoughts, physical sensations, and situations with intensity ratings
- **📊 Progress Dashboard**: Track assessment sessions and coaching history with detailed analytics

### User Experience
- **🔐 Authentication**: Firebase Google OAuth + Guest mode with email capture
- **💾 Data Privacy**: Local storage with export/import functionality and user-controlled data deletion
- **⚙️ Settings Panel**: Complete data control - export, import, and clear personal data
- **🎨 Emotional Theme**: Purple/pink color scheme designed for emotional awareness

### Admin Features
- **👨‍💼 Admin Dashboard**: Comprehensive admin panel with user activity tracking
- **📈 User Analytics**: Real-time statistics on users, sessions, engagement, and retention
- **📋 Activity Logs**: Detailed tracking of all user actions with filtering and CSV export
- **🔧 Data Management**: Advanced tools for monitoring and managing app data

### Technical Stack
- **⚡ Modern Stack**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4
- **🎨 Design System**: shadcn/ui components with custom OKLCH color system
- **📦 State Management**: Zustand with localStorage persistence
- **🔒 Access Control**: Scenario Access Token (SAT) support for private scenarios

## 🚀 Quick Start (5 minutes)

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (Install: `npm install -g pnpm`)
- **ToughTongue AI Account** ([Sign up](https://www.toughtongueai.com/))

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your credentials:

```env
# Required: ToughTongue AI API Configuration
TOUGH_TONGUE_API_KEY=your_api_key_here

# Required: Firebase Configuration (for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Development Mode (enables admin panel)
NEXT_PUBLIC_IS_DEV=true

# Admin Configuration (change for production!)
ADMIN_TOKEN=your_secure_admin_token_here
```

**Where to get credentials:**

#### 🎤 ToughTongue AI API Key

1. Go to [ToughTongue AI Developer Portal](https://app.toughtongueai.com/developer?tab=api-keys)
2. Click "Create New API Key"
3. Copy the API key and paste into `.env.local` as `TOUGH_TONGUE_API_KEY`

#### 🔥 Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Email/Password** and **Google** providers
4. Go to Project Settings → General → Your apps → Web app
5. Copy the config values into your `.env.local`

### Step 3: Update Scenario IDs

The app requires ToughTongue AI scenario IDs. To configure:

1. Open `lib/ttai/constants.ts`
2. Update the `SCENARIOS` object with your scenario IDs:

```typescript
export const SCENARIOS = {
  PERSONALITY_TEST: "your_assessment_scenario_id",
  PERSONALITY_COACH: "your_coaching_scenario_id",
} as const;
```

### Step 4: Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
alexiAId/
├── app/
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx                       # Root layout with auth
│   ├── globals.css                      # Global styles with OKLCH theme
│   │
│   ├── test/
│   │   └── page.tsx                     # Emotion assessment
│   │
│   ├── coach/
│   │   └── page.tsx                     # AI emotion coach
│   │
│   ├── results/
│   │   └── page.tsx                     # Progress dashboard
│   │
│   ├── journal/
│   │   ├── page.tsx                     # Journal main page
│   │   ├── JournalEntryForm.tsx         # Create/edit journal entries
│   │   └── JournalEntryList.tsx         # Display journal entries
│   │
│   ├── settings/
│   │   └── page.tsx                     # Data & privacy settings
│   │
│   ├── admin/
│   │   ├── page.tsx                     # Admin dashboard
│   │   ├── ActivityTracker.tsx          # User activity logs
│   │   ├── UserStatsCard.tsx            # Analytics dashboard
│   │   ├── BalanceCard.tsx              # API balance display
│   │   ├── SessionsCard.tsx             # Session management
│   │   └── LocalStoreEditor.tsx         # Data editor
│   │
│   ├── auth/
│   │   ├── AuthContext.tsx              # Auth provider & hooks
│   │   └── signin/page.tsx              # Sign-in page
│   │
│   └── api/                             # API routes (server-side)
│       ├── balance/route.ts             # Get account balance
│       ├── access-token/route.ts        # Create access tokens
│       └── sessions/
│           ├── route.ts                 # List sessions
│           ├── [sessionId]/route.ts     # Get session details
│           └── analyze/route.ts         # Analyze session
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   ├── auth/                            # Auth components
│   ├── Header.tsx                       # Navigation
│   ├── PageHeader.tsx                   # Page title component
│   ├── StatusCards.tsx                  # Status displays
│   ├── EmptyState.tsx                   # Empty state UI
│   └── TTAIIframe.tsx                   # ToughTongue AI embed
│
├── lib/
│   ├── config.ts                        # Environment config
│   ├── constants.ts                     # App constants & routes
│   ├── firebase.ts                      # Firebase initialization
│   ├── store.ts                         # Zustand store
│   ├── auth.ts                          # Auth utilities
│   ├── utils.ts                         # General utilities
│   └── ttai/                            # ToughTongue AI SDK
│       ├── client.ts                    # Client-side utilities
│       ├── constants.ts                 # TTAI constants
│       ├── types.ts                     # TypeScript types
│       └── index.ts                     # Exports
│
├── docs/
│   └── ACCESS_TOKEN_USAGE.md            # SAT token documentation
│
└── package.json
```

## 🎯 How the App Works

### 1. **Landing Page** (`/`)
- Welcomes users with emotional support messaging
- Explains alexithymia and emotion translation
- Showcases physical sensations and emotional connections
- Call-to-action buttons for assessment or coaching

### 2. **Authentication** (`/auth/signin`)
- **Google Sign-In**: OAuth authentication via Firebase
- **Guest Mode**: Name + email required for local accounts
- Automatic activity logging on sign-in/sign-out
- Persistent sessions with localStorage

### 3. **Emotion Assessment** (`/test`)
- Embeds ToughTongue AI emotion awareness scenario
- Real-time session tracking with iframe events
- Automatic analysis on completion
- Results saved to localStorage with timestamps
- View previous assessment history

### 4. **Emotion Coach** (`/coach`)
- Interactive AI coaching conversations
- Personalized guidance based on assessment results
- Session history tracking
- Resume or start new coaching sessions

### 5. **Emotion Journal** (`/journal`)
- **Create Entries**: 20+ emotions with custom options
- **Intensity Scale**: 1-5 rating system with visual indicators
- **Context Tracking**: What happened, thoughts, physical sensations
- **Entry Management**: Edit, delete with confirmation
- **Timeline View**: Sorted by date with expandable details
- Color-coded emotion badges and intensity levels

### 6. **Progress Dashboard** (`/results`)
- Assessment results with emotion evaluation
- Coaching session history
- Activity timeline
- Quick actions for new sessions

### 7. **Settings & Privacy** (`/settings`)
- **Export Data**: Download all data as JSON backup
- **Import Data**: Restore from previous export
- **Clear My Data**: Delete journal entries (sessions preserved)
- **Clear All**: Nuclear option with strong warnings
- Privacy notice explaining local storage

### 8. **Admin Dashboard** (`/admin`)
- **Overview Tab**:
  - User statistics (total, active 7d/30d, engagement rate)
  - Account balance monitoring
  - Session management with filtering
  - Session analysis tools
  
- **Activity Tab**:
  - Real-time activity log with 12 tracked actions
  - Filter by user, action type, date range
  - CSV export for reporting
  - Color-coded action categories
  
- **Data Tab**:
  - Raw store editor for debugging
  - JSON view of application state
  - Manual data manipulation

## 🔐 Authentication Flow

The template uses **Firebase Authentication**:

### Using Auth in Components

```typescript
"use client";
import { useAuth } from "@/app/auth/AuthContext";

function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please sign in</p>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## 💾 Data Storage & State Management

The app uses **Zustand** with localStorage persistence (`lib/store.ts`):

### Store Schema

```typescript
interface AppState {
  // User management
  user: User | null;
  
  // Admin access
  adminToken: string | null;
  
  // Personality assessment
  userPersonalityType: string | null;
  userPersonalityAssessment: string | null;
  userPersonalitySessionId: string | null;
  
  // Session tracking
  assessmentSessions: string[];
  coachSessions: string[];
  sessionDetails: Record<string, SessionDetails>;
  
  // Journal entries
  journalEntries: JournalEntry[];
  
  // Activity tracking (admin)
  activityLogs: ActivityLog[];
}
```

### Journal Entry Structure

```typescript
interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  emotions: string[];
  intensity: 1 | 2 | 3 | 4 | 5;
  situation: string;
  thoughts: string;
  bodySensations: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Activity Log Structure

```typescript
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  action: "sign_in" | "sign_out" | "start_assessment" | 
          "complete_assessment" | "start_coaching" | 
          "complete_coaching" | "create_journal" | 
          "update_journal" | "delete_journal" | 
          "export_data" | "import_data" | "clear_data";
  details?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
```

### Using the Store

```typescript
import { useAppStore } from "@/lib/store";

function MyComponent() {
  // Get state
  const user = useAppStore((s) => s.user);
  const journalEntries = useAppStore((s) => s.journalEntries);
  const activityLogs = useAppStore((s) => s.activityLogs);
  
  // Get actions
  const addJournalEntry = useAppStore((s) => s.addJournalEntry);
  const logActivity = useAppStore((s) => s.logActivity);
  const exportData = useAppStore((s) => s.exportData);
  
  // Use actions
  const handleCreateEntry = () => {
    addJournalEntry({
      userId: user!.id,
      date: new Date().toISOString(),
      emotions: ["Happy", "Excited"],
      intensity: 4,
      situation: "Got good news",
      thoughts: "Feeling optimistic",
      bodySensations: "Light chest, smiling",
    });
  };
  
  // Export data
  const handleExport = () => {
    const jsonData = exportData();
    // Download or save jsonData
  };
}
```

### Storage Key

All data is persisted under: `ttai-app-store`

### Data Control Actions

```typescript
// Export all data as JSON
const jsonData = exportData();

// Import data from JSON
const success = importData(jsonData);

// Clear user-specific data
clearUserData(userId);

// Clear all data (nuclear option)
clearAll();
```

## 🎨 Customization

### Change App Name and Description

Edit `lib/config.ts`:

```typescript
export const APP_NAME = "Your App Name";
export const APP_DESCRIPTION = "Your app description";
```

### Add New Scenarios

1. Get scenario ID from ToughTongue AI
2. Add to `lib/constants.ts`:

```typescript
export const SCENARIOS = {
  PERSONALITY_TEST: "existing_id",
  PERSONALITY_COACH: "existing_id",
  YOUR_NEW_SCENARIO: "new_scenario_id",
} as const;
```

3. Create a new page in `app/your-scenario/page.tsx`
4. Use the scenario URL: `SCENARIO_URLS.YOUR_NEW_SCENARIO`

### Styling

The project uses Tailwind CSS. Customize:

- **`tailwind.config.ts`**: Theme configuration
- **`app/globals.css`**: Global styles
- **Component files**: Use Tailwind classes directly

### Adding Pages

1. Create directory in `app/`
2. Add `page.tsx`
3. Update navigation in `components/Header.tsx`
4. Add route to `ROUTES` in `lib/constants.ts`

## 📡 API Routes

### Account Management

#### `GET /api/balance`
Get ToughTongue AI account balance:

```typescript
const response = await fetch("/api/balance", {
  headers: { "x-admin-token": adminToken }
});
const data = await response.json();
// { available_minutes: 1616.5, last_updated: "2026-01-02T18:25:26Z" }
```

### Session Management

#### `GET /api/sessions`
List sessions with filtering:

```typescript
const response = await fetch(
  "/api/sessions?scenario_id=xxx&limit=100",
  { headers: { "x-admin-token": adminToken } }
);
const data = await response.json();
// { sessions: [...] }
```

#### `GET /api/sessions/[sessionId]`
Get detailed session information:

```typescript
const response = await fetch(`/api/sessions/${sessionId}`, {
  headers: { "x-admin-token": adminToken }
});
const session = await response.json();
```

#### `POST /api/sessions/analyze`
Analyze a completed session:

```typescript
const response = await fetch("/api/sessions/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-token": adminToken
  },
  body: JSON.stringify({ session_id: sessionId }),
});
const analysis = await response.json();
```

### Access Token Management

#### `POST /api/access-token`
Create short-lived Scenario Access Token (SAT):

```typescript
const response = await fetch("/api/access-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    scenario_id: "scenario_abc123",
    duration_hours: 4, // 1-24 hours
    email: "user@example.com" // Optional
  }),
});
const { access_token, expires_at } = await response.json();
```

See `docs/ACCESS_TOKEN_USAGE.md` for complete documentation.

## 👨‍💼 Admin Panel

Access at `/admin` (requires `NEXT_PUBLIC_IS_DEV=true` and admin token)

### Authentication
Enter your `ADMIN_TOKEN` from environment variables to access the dashboard.

### Dashboard Tabs

#### 📊 Overview Tab
- **User Statistics Card**
  - Total users and active users (7d/30d)
  - Sign-ins and total activities
  - Session counts and completion rates
  - Average session duration
  - Journal entry statistics
  - Engagement and retention rates

- **Account Balance**
  - Available API minutes
  - Last updated timestamp
  - Refresh button

- **Session Management**
  - Filter by scenario type
  - View session list with details
  - Copy session IDs
  - Trigger session analysis
  - View analysis results

#### 📋 Activity Tab
- **Activity Log Table**
  - Real-time user action tracking
  - 12 tracked action types
  - Filterable by:
    - User name/email (fuzzy search)
    - Action type
    - Date range
  - Color-coded action badges
  - Relative timestamps
  - CSV export functionality
  - Clear all logs option

**Tracked Actions:**
- Authentication: sign_in, sign_out
- Assessments: start_assessment, complete_assessment
- Coaching: start_coaching, complete_coaching
- Journal: create_journal, update_journal, delete_journal
- Data: export_data, import_data, clear_data

#### 🗄️ Data Tab
- **Local Store Editor**
  - View raw application state
  - JSON format
  - Manual data manipulation
  - Debug tool for development

### Admin Features Summary
- ✅ Real-time user activity monitoring
- ✅ Comprehensive analytics dashboard
- ✅ Session management and analysis
- ✅ Activity log with filtering and export
- ✅ Data inspection and debugging tools
- ✅ User engagement metrics
- ✅ Privacy-focused (all data local)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

2. **Import in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `TOUGH_TONGUE_API_KEY`
     - All Firebase config variables
     - `ADMIN_TOKEN` (use secure token for production!)
     - `NEXT_PUBLIC_IS_DEV=false` (disable admin in production)

4. **Deploy:**
   - Click "Deploy"
   - Vercel auto-deploys on future git pushes

### Production Checklist

- [ ] Set secure `ADMIN_TOKEN` (not default)
- [ ] Set `NEXT_PUBLIC_IS_DEV=false` to disable admin panel
- [ ] Add authorized domains to Firebase Console
- [ ] Test Google Sign-In with production URL
- [ ] Verify CSP headers for ToughTongue AI embeds
- [ ] Test data export/import functionality
- [ ] Review privacy policy for localStorage usage

## 🛠️ Troubleshooting

### Firebase Authentication Issues

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**:
1. Verify all Firebase config values in `.env.local`
2. Enable Email/Password + Google auth in Firebase Console
3. Add authorized domains (including localhost for development)
4. Check CSP headers in `next.config.ts`
5. Restart dev server: `pnpm dev`

### ToughTongue AI Session Not Starting

**Possible causes:**
1. Invalid API key
2. Incorrect scenario ID
3. Browser blocking microphone
4. CSP blocking iframe

**Solution**:
1. Verify `TOUGH_TONGUE_API_KEY` in [Developer Portal](https://app.toughtongueai.com/developer)
2. Check scenario IDs in `lib/ttai/constants.ts`
3. Allow microphone permission
4. Check browser console for CSP errors

### Data Not Persisting

**Cause**: localStorage limitations

**Solution**:
- Data is browser-specific (not synced across devices)
- Private/Incognito mode clears data on window close
- Use Export feature to backup data regularly
- Import data to restore on new browser/device

### Admin Panel Not Accessible

**Solutions**:
1. Ensure `NEXT_PUBLIC_IS_DEV=true` in `.env.local`
2. Verify `ADMIN_TOKEN` matches in environment and login
3. Restart dev server after environment changes
4. Check browser console for errors

### Type Errors with Firebase User

**Issue**: `userEmail` type errors (null vs undefined)

**Solution**: Use nullish coalescing:
```typescript
userEmail: user.email || undefined
```

### Journal Entries Not Saving

**Possible causes:**
1. User not authenticated
2. localStorage quota exceeded
3. Browser security settings

**Solution**:
1. Verify user is signed in
2. Check localStorage size (clear old data if needed)
3. Try different browser or clear site data

## 📚 Learn More

### Documentation
- **[ToughTongue AI Documentation](https://docs.toughtongueai.com)** - API reference and guides
- **[Access Token Guide](./docs/ACCESS_TOKEN_USAGE.md)** - SAT token implementation
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js 15 features
- **[Firebase Documentation](https://firebase.google.com/docs)** - Authentication setup
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling reference
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library

### Community & Support
- **[Developer Discord](https://discord.com/invite/jfq2wVAP)** - Get help from the community
- **[API Playground](https://app.toughtongueai.com/api-playground)** - Test API calls
- **[Email Support](mailto:help@getarchieai.com)** - Direct support

## 🎨 Customization Guide

### Change App Branding

Edit `lib/config.ts`:
```typescript
export const AppConfig = {
  app: {
    name: "Your App Name",
    shortName: "YourApp",
    description: "Your description",
  },
};
```

### Update Theme Colors

The app uses OKLCH color system in `app/globals.css`:
```css
:root {
  --primary: oklch(0.62 0.18 280); /* Purple */
  --secondary: oklch(0.70 0.15 300); /* Pink */
}
```

### Add New Routes

1. Create page in `app/your-route/page.tsx`
2. Add route to `lib/constants.ts`:
```typescript
export const ROUTES = {
  YOUR_ROUTE: "/your-route",
} as const;
```
3. Update `components/Header.tsx` navigation

### Modify Journal Features

Edit `app/journal/JournalEntryForm.tsx`:
- Add/remove emotions in `COMMON_EMOTIONS` array
- Change intensity scale range
- Add custom fields to form
- Update `JournalEntry` type in `lib/store.ts`

## 📊 Analytics Integration

### Add Google Analytics

1. Install package:
```bash
pnpm add @next/third-parties
```

2. Add to `app/layout.tsx`:
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### Track Custom Events

Use the activity logging system:
```typescript
logActivity({
  userId,
  userName,
  userEmail,
  action: "custom_action",
  details: "Event description",
  metadata: { key: "value" }
});
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use strong admin tokens** - Generate with: `openssl rand -base64 32`
3. **Disable admin in production** - Set `NEXT_PUBLIC_IS_DEV=false`
4. **Regular data exports** - Encourage users to backup
5. **CSP headers** - Review `next.config.ts` for iframe security
6. **HTTPS only** - Always use HTTPS in production
7. **Rate limiting** - Consider adding rate limits to API routes

## 📝 License

MIT License - feel free to use this project for personal or commercial use.

---

**Emotion Translator** - Helping alexithymic individuals understand and express emotions  
Built with ❤️ using Next.js 15, ToughTongue AI, Firebase, and Tailwind CSS

### Credits
- **ToughTongue AI** - AI-powered emotion coaching platform
- **Next.js** - React framework for production
- **Firebase** - Authentication and hosting
- **shadcn/ui** - Beautiful component library
- **Vercel** - Deployment platform
