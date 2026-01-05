/**
 * Firebase Configuration
 *
 * Initializes Firebase app and authentication.
 * Only initializes if valid config is present and we're in a browser.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { AppConfig } from "./config";

// Check if we're in a browser environment and have valid config
const isConfigValid =
  typeof window !== "undefined" &&
  AppConfig.firebase.apiKey &&
  AppConfig.firebase.apiKey !== "your_firebase_api_key";

// Initialize Firebase only if config is valid
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isConfigValid) {
  app = getApps().length === 0 ? initializeApp(AppConfig.firebase) : getApps()[0];
  auth = getAuth(app);
}

export { app, auth };
