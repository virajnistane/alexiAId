"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppStore, type User as StoreUser } from "@/lib/store";

// Combined user type
export type AppUser = { type: "firebase"; user: FirebaseUser } | { type: "local"; user: StoreUser };

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  // Google auth
  signInWithGoogle: () => Promise<void>;
  // Local user auth
  signInAsLocalUser: (name: string, email: string) => void;
  // Sign out
  logout: () => Promise<void>;
  // Helpers
  getUserName: () => string;
  getUserEmail: () => string;
  getUserId: () => string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Store for local user persistence
  const storeUser = useAppStore((s) => s.user);
  const setStoreUser = useAppStore((s) => s.setUser);
  const logActivity = useAppStore((s) => s.logActivity);

  // Check for local user on mount
  useEffect(() => {
    // First check store for local user
    if (storeUser && storeUser.type === "local") {
      setCurrentUser({ type: "local", user: storeUser });
      setLoading(false);
      return;
    }

    // Then check Firebase auth state
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Sync Firebase user to store (only if not already set to prevent loops)
        const currentStoreUser = useAppStore.getState().user;
        if (!currentStoreUser || currentStoreUser.id !== firebaseUser.uid) {
          setStoreUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email || undefined,
            type: "firebase",
            createdAt: new Date().toISOString(),
          });
        }
        setCurrentUser({ type: "firebase", user: firebaseUser });
      } else {
        // Check again for local user from store
        const localUser = useAppStore.getState().user;
        if (localUser && localUser.type === "local") {
          setCurrentUser({ type: "local", user: localUser });
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setStoreUser]); // Remove storeUser from dependencies to prevent loop

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase auth not initialized. Please check your Firebase configuration in .env.local");
    }
    
    try {
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      console.log("Attempting Google Sign-In...");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Sign-in successful:", result.user.email);
      
      // Log activity
      logActivity({
        userId: result.user.uid,
        userName: result.user.displayName || result.user.email?.split("@")[0] || "User",
        userEmail: result.user.email || undefined,
        action: "sign_in",
        details: "Signed in with Google",
      });
    } catch (error: any) {
      // Handle popup closed by user silently
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("User cancelled sign-in");
        return;
      }
      
      // Log other errors for debugging
      console.error("❌ Google Sign-In Error:", {
        code: error.code,
        message: error.message,
      });
      
      // Provide more helpful error messages
      if (error.code === 'auth/internal-error') {
        // Check if there's a more detailed message in customData
        const details = error.customData?._tokenResponse?.error?.message || error.message;
        throw new Error(`Firebase internal error: ${details}. This usually means:\n1. Google Sign-In is not properly enabled in Firebase Console\n2. OAuth consent screen is not configured\n3. Your domain is not authorized\n\nCheck the browser console for full error details.`);
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error("Popup was blocked. Please allow popups for this site.");
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error("This domain is not authorized. Add it to Firebase Console → Authentication → Settings → Authorized domains.");
      }
      
      // Throw the original error message for other cases
      throw new Error(error.message || "Failed to sign in with Google");
    }
  };

  const signInAsLocalUser = (name: string, email: string) => {
    const localUser: StoreUser = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.trim(),
      type: "local",
      createdAt: new Date().toISOString(),
    };
    setStoreUser(localUser);
    setCurrentUser({ type: "local", user: localUser });
    
    // Log activity
    logActivity({
      userId: localUser.id,
      userName: localUser.name,
      userEmail: localUser.email,
      action: "sign_in",
      details: "Signed in as guest",
    });
  };

  const logout = async () => {
    // Log activity before clearing user
    if (currentUser) {
      const userId = currentUser.type === "local" ? currentUser.user.id : currentUser.user.uid;
      const userName =
        currentUser.type === "local"
          ? currentUser.user.name
          : currentUser.user.displayName || currentUser.user.email?.split("@")[0] || "User";
      const userEmail =
        currentUser.type === "local" ? currentUser.user.email : currentUser.user.email;

      logActivity({
        userId,
        userName,
        userEmail: userEmail || undefined,
        action: "sign_out",
        details: "Signed out",
      });
    }

    // Clear user from store
    setStoreUser(null);

    // Sign out from Firebase if signed in
    if (auth && currentUser?.type === "firebase") {
      await firebaseSignOut(auth);
    }

    setCurrentUser(null);
  };

  const getUserName = (): string => {
    if (!currentUser) return "";
    if (currentUser.type === "local") {
      return currentUser.user.name;
    }
    return currentUser.user.displayName || currentUser.user.email?.split("@")[0] || "";
  };

  const getUserEmail = (): string => {
    if (!currentUser) return "";
    if (currentUser.type === "local") {
      return currentUser.user.email || "";
    }
    return currentUser.user.email || "";
  };

  const getUserId = (): string => {
    if (!currentUser) return "";
    if (currentUser.type === "local") {
      return currentUser.user.id;
    }
    return currentUser.user.uid;
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInAsLocalUser,
    logout,
    getUserName,
    getUserEmail,
    getUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
