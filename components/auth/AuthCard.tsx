"use client";

import { useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthMode = "choose" | "local";

interface AuthCardProps {
  /** Called after successful authentication */
  onSuccess?: () => void;
  /** Title displayed in the card header */
  title?: string;
  /** Description displayed below the title */
  description?: string;
  /** Whether to show the card in a compact form */
  compact?: boolean;
}

/**
 * Reusable authentication card component
 * Supports Google OAuth and local (guest) sign-in
 */
export function AuthCard({
  onSuccess,
  title = "Welcome",
  description,
  compact = false,
}: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>("choose");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInAsLocalUser } = useAuth();

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: unknown) {
      // Only show error if one was actually thrown
      // (popup-closed-by-user returns silently without throwing)
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocalSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    signInAsLocalUser(name.trim(), email.trim());
    onSuccess?.();
  };

  const getDescription = () => {
    if (description) return description;
    return mode === "choose"
      ? "Choose how you'd like to continue"
      : "Enter your details to get started";
  };

  return (
    <Card className={`w-full ${compact ? "max-w-sm" : "max-w-md"} border-border bg-card`}>
      <CardHeader className={`space-y-1 text-center ${compact ? "pb-4" : ""}`}>
        {!compact && (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20">
            <span className="text-3xl">🧠</span>
          </div>
        )}
        <CardTitle className={compact ? "text-xl" : "text-2xl font-bold"}>{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {mode === "choose" ? (
          <div className="space-y-4">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className={`w-full ${compact ? "h-10" : "h-12"} text-base`}
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon className="mr-3 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Local User */}
            <Button
              type="button"
              variant="secondary"
              className={`w-full ${compact ? "h-10" : "h-12"} text-base`}
              onClick={() => setMode("local")}
              disabled={loading}
            >
              <UserIcon className="mr-3 h-5 w-5" />
              Continue as Guest
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Guest sessions are stored locally on this device
            </p>
          </div>
        ) : (
          <form onSubmit={handleLocalSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="auth-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="auth-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className={compact ? "h-10" : "h-12"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="auth-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="auth-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={compact ? "h-10" : "h-12"}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className={`w-full ${
                compact ? "h-10" : "h-12"
              } text-base bg-teal-600 hover:bg-teal-700`}
              disabled={loading}
            >
              Get Started
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setMode("choose");
                setError("");
                setName("");
                setEmail("");
              }}
            >
              ← Back to options
            </Button>
          </form>
        )}

        {error && mode === "choose" && (
          <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Icons
// =============================================================================

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
