/**
 * Firebase Configuration
 *
 * Initializes Firebase app and authentication.
 * Only initializes in the browser (client-side only).
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { AppConfig } from "./config";

// Initialize Firebase only on the client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Only initialize Firebase in the browser
if (typeof window !== "undefined") {
  // Check if we have valid config
  const isConfigValid =
    AppConfig.firebase.apiKey &&
    AppConfig.firebase.apiKey !== "your_firebase_api_key" &&
    AppConfig.firebase.projectId;

  if (isConfigValid) {
    try {
      console.log("Initializing Firebase with config:", {
        apiKey: AppConfig.firebase.apiKey?.substring(0, 10) + "...",
        authDomain: AppConfig.firebase.authDomain,
        projectId: AppConfig.firebase.projectId,
      });
      
      app = getApps().length === 0 ? initializeApp(AppConfig.firebase) : getApps()[0];
      auth = getAuth(app);
      console.log("✅ Firebase initialized successfully");
    } catch (error) {
      console.error("❌ Firebase initialization error:", error);
    }
  } else {
    console.warn("⚠️ Firebase config is invalid - check your .env.local file");
  }
}

export { app, auth };
