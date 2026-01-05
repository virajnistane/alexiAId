/**
 * Central configuration file for all environment variables
 * This is the single source of truth for loading process.env values
 */

const DEFAULT_ADMIN_TOKEN = "TTAI-STARTER-ADMIN-TOKEN";

/**
 * Application Configuration
 * Centralized config object with nested structure
 */
export const AppConfig = {
  app: {
    name: "Emotion Translator",
    shortName: "EmotionTranslator",
    description: "AI-powered emotion recognition and translation support for alexithymic individuals",
    isDev: process.env.NEXT_PUBLIC_IS_DEV === "true",
  },

  toughTongue: {
    apiKey: process.env.TOUGH_TONGUE_API_KEY || "",
  },

  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  },

  admin: {
    token: process.env.ADMIN_TOKEN || DEFAULT_ADMIN_TOKEN,
    defaultToken: DEFAULT_ADMIN_TOKEN,
  },
} as const;

// Validation helper (not exported)
const isConfigValid = (config: Record<string, string>): boolean => {
  return Object.values(config).every((value) => value && value !== "");
};

// Validation functions
export const isFirebaseConfigured = (): boolean => {
  return isConfigValid(AppConfig.firebase);
};

export const isToughTongueConfigured = (): boolean => {
  return AppConfig.toughTongue.apiKey !== "";
};
