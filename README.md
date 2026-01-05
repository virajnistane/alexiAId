# Emotion Translator - Next.js Starter Template

A production-ready emotion translation and coaching app built with Next.js 15, ToughTongue AI, Firebase Authentication, and TypeScript. Designed to help alexithymic individuals understand, identify, and express their emotions through AI-powered support.

## ✨ Features

- **🧠 Emotion Awareness Assessment**: Interactive AI-powered assessment to build emotional recognition skills
- **💬 Emotion Coach**: AI coach that provides personalized guidance on understanding and expressing emotions
- **📊 Progress Dashboard**: Track assessment sessions and coaching history
- **🔐 Firebase Authentication**: Email/password + Google OAuth sign-in
- **💾 Local Storage**: Results saved in browser localStorage for persistence
- **👨‍💼 Admin Panel**: Secure admin dashboard for data management
- **⚡ Modern Stack**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS

## 🚀 Quick Start (5 minutes)

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (Install: `npm install -g pnpm`)
- **ToughTongue AI Account** ([Sign up](https://www.toughtongueai.com/))

### Step 1: Install Dependencies

```bash
cd nextjs-minimal
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

### Step 3: Update Scenario IDs (Optional)

The template includes a default personality test scenario. To use your own scenarios:

1. Open `lib/constants.ts`
2. Update the `SCENARIOS` object with your scenario IDs:

```typescript
export const SCENARIOS = {
  PERSONALITY_TEST: "your_personality_test_scenario_id",
  PERSONALITY_COACH: "your_personality_coach_scenario_id",
} as const;
```

### Step 4: Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
nextjs-minimal/
├── app/
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx                       # Root layout with auth
│   │
│   ├── personality-test/
│   │   └── page.tsx                     # MBTI personality test
│   │
│   ├── personality-coach/
│   │   └── page.tsx                     # AI personality coach
│   │
│   ├── progress/
│   │   └── page.tsx                     # Progress dashboard
│   │
│   ├── admin/
│   │   └── page.tsx                     # Admin panel (token-protected)
│   │
│   ├── auth/
│   │   ├── AuthContext.tsx              # Firebase auth provider
│   │   ├── signin/page.tsx              # Sign-in page
│   │   └── signup/page.tsx              # Sign-up page
│   │
│   └── api/tough-tongue/                # API routes (server-side)
│       ├── scenarios/route.ts           # Create scenarios
│       └── sessions/
│           ├── [sessionId]/route.ts     # Get session details
│           └── analyze/route.ts         # Analyze session
│
├── components/
│   ├── ui/                              # shadcn/ui components
│   ├── AdminTokenBanner.tsx             # Security warning banner
│   └── Header.tsx                       # Navigation header
│
├── lib/
│   ├── config.ts                        # Centralized env config
│   ├── constants.ts                     # App constants & scenario IDs
│   ├── firebase.ts                      # Firebase initialization
│   └── utils.ts                         # Utility functions
│
└── package.json
```

## 🎯 How the App Works

### 1. **Landing Page** (`/`)

- Welcomes users to the emotion translation journey
- Explains how the app helps alexithymic individuals
- Showcases common emotional experiences and physical sensations
- Call-to-action buttons to start assessment or talk to coach

### 2. **Emotion Assessment** (`/test`)

- Embeds ToughTongue AI emotion awareness assessment scenario
- Listens for session completion events
- Automatically analyzes results via API
- Saves results to localStorage
- Shows previous test results if completed
- Allows retaking the test

### 3. **Personality Coach** (`/personality-coach`)

- Embeds ToughTongue AI coaching scenario
- Personalizes conversation with user's MBTI type (if test taken)
- Tracks all coaching sessions in localStorage
- Shows session history

### 4. **Progress Dashboard** (`/progress`)

- Displays personality test results (with MBTI type)
- Lists all coaching sessions with timestamps
- Shows statistics (tests completed, sessions, etc.)
- Allows refreshing/updating session data
- Quick actions to retake test or start new session

### 5. **Admin Panel** (`/admin`)

- Protected by ADMIN_TOKEN
- Shows app statistics
- Allows exporting all data as JSON
- Clear individual data types or all data
- Security warnings if using default token

### 6. **Admin Token Banner**

- Appears on all pages if using default admin token
- Reminds admins to set custom ADMIN_TOKEN
- Dismissible but reappears on page refresh

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

## 💾 Data Storage

The app uses **Zustand** with localStorage persistence (`lib/store.ts`):

```typescript
interface AppState {
  user: User | null; // Current user (local or Firebase)
  assessmentSessions: string[]; // Assessment session IDs
  coachSessions: string[]; // Coach session IDs
  sessionDetails: Record<string, SessionDetails>; // Session data keyed by ID
}
```

### Using the Store

```typescript
import { useAppStore, selectLatestAssessment, selectPersonalityType } from "@/lib/store";

// In a component
function MyComponent() {
  // Get latest assessment
  const latestAssessment = useAppStore(selectLatestAssessment);
  const personalityType = useAppStore(selectPersonalityType);

  // Get all sessions
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const sessionDetails = useAppStore((s) => s.sessionDetails);

  // Actions
  const addAssessmentSession = useAppStore((s) => s.addAssessmentSession);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);
}
```

### Storage Key

All data is persisted under the localStorage key: `ttai-app-store`

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

### `GET /api/balance`

Get account balance (available minutes):

```typescript
const response = await fetch("/api/balance");
const data = await response.json();
// { available_minutes: 1616.5, last_updated: "2026-01-02T18:25:26.018000" }
```

### `GET /api/sessions`

List sessions with optional filtering:

```typescript
const response = await fetch("/api/sessions?scenario_id=xxx&limit=100");
const data = await response.json();
// { sessions: [...] }
```

### `GET /api/sessions/[sessionId]`

Get session details:

```typescript
const response = await fetch(`/api/sessions/${sessionId}`);
const data = await response.json();
```

### `POST /api/sessions/analyze`

Analyze a completed session:

```typescript
const response = await fetch("/api/sessions/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ session_id: sessionId }),
});
const analysis = await response.json();
```

### `POST /api/scenarios`

Create a new scenario:

```typescript
const response = await fetch("/api/scenarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Scenario Name",
    description: "Description",
    ai_instructions: "AI instructions...",
  }),
});
```

## 👨‍💼 Admin Panel

Access the admin panel at `/admin` with your ADMIN_TOKEN.

### Default Admin Token

By default, the token is: `TTAI-STARTER-ADMIN-TOKEN`

**⚠️ IMPORTANT**: Change this for production! Set a custom `ADMIN_TOKEN` in your environment variables.

### Admin Features

- View app statistics (tests, sessions, storage)
- Export all data as JSON
- Clear test data
- Clear coach session data
- Clear all data
- View configuration (scenario IDs)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

2. **Import in Vercel:**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - **Important**: Set root directory to `nextjs-minimal`

3. **Add Environment Variables:**

   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`
   - **⚠️ Set a secure `ADMIN_TOKEN` for production!**

4. **Deploy:**
   - Click "Deploy"
   - Vercel will auto-deploy on future git pushes

## 🛠️ Troubleshooting

### ❌ Firebase Configuration Errors

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**:

1. Double-check all Firebase config values in `.env.local`
2. Ensure you've enabled Email/Password and Google authentication in Firebase Console
3. Restart dev server: `pnpm dev`

### ❌ ToughTongue AI Session Not Starting

**Possible causes:**

1. Invalid API key in `.env.local`
2. Scenario ID not configured
3. Browser blocking microphone permission

**Solution**:

1. Verify `TOUGH_TONGUE_API_KEY` in [Developer Portal](https://app.toughtongueai.com/developer)
2. Check scenario IDs in `lib/constants.ts`
3. Allow microphone access when prompted

### ❌ Admin Panel Won't Accept Token

**Solution**:

1. Check `ADMIN_TOKEN` in `.env.local`
2. Restart dev server after changing environment variables
3. If using default token, ensure you're entering: `TTAI-STARTER-ADMIN-TOKEN`

### ❌ Data Not Persisting

**Cause**: localStorage is browser-specific

**Solution**:

- Data is stored per-browser
- Clearing browser data will delete saved results
- For production, consider adding database sync (Firebase/Supabase)

## 📚 Learn More

- **[ToughTongue AI Documentation](https://docs.toughtongueai.com)**
- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Firebase Documentation](https://firebase.google.com/docs)**
- **[Tailwind CSS](https://tailwindcss.com/docs)**

## 💬 Support & Community

- **[Developer Community Discord](https://discord.com/invite/jfq2wVAP)**
- **[API Playground](https://app.toughtongueai.com/api-playground)**
- **[Email Support](mailto:help@getarchieai.com)**

## 📝 License

MIT License - feel free to use this template for any project!

---

Built with ❤️ using Next.js, ToughTongue AI, and Firebase
