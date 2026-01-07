"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";
import { AuthCard } from "@/components/auth";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/");
    }
  }, [currentUser, loading, router]);

  const handleSuccess = () => {
    router.push("/");
  };

  // Don't show anything while checking auth or if already logged in
  if (loading || currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthCard onSuccess={handleSuccess} />
    </div>
  );
}
