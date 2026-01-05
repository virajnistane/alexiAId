"use client";

import { useAuth } from "@/app/auth/AuthContext";
import { AuthCard } from "./AuthCard";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  /** The protected content to render when authenticated */
  children: React.ReactNode;
  /** Title for the auth prompt */
  title?: string;
  /** Description explaining why auth is required */
  description?: string;
  /** Show a loading spinner while checking auth state */
  showLoading?: boolean;
}

/**
 * Protects content behind authentication.
 * Shows AuthCard when user is not authenticated.
 */
export function AuthGuard({
  children,
  title = "Sign In Required",
  description = "Please sign in to access this feature",
  showLoading = true,
}: AuthGuardProps) {
  const { currentUser, loading } = useAuth();

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-500" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth card if not authenticated
  if (!currentUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <AuthCard title={title} description={description} />
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Higher-order component version of AuthGuard
 * @example
 * export default withAuthGuard(MyProtectedPage, {
 *   title: "Sign In Required",
 *   description: "Please sign in to access this feature"
 * });
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
