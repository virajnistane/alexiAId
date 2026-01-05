/**
 * Admin Token Input Component
 *
 * A reusable component for entering and managing the admin authentication token.
 * Supports two variants:
 * - "full": Card-based login form for unauthenticated users
 * - "compact": Inline input for updating token in the header
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, Lock, Key } from "lucide-react";

interface AdminTokenInputProps {
  /** Display variant - "full" for login card, "compact" for header inline */
  variant?: "full" | "compact";
  /** Callback fired after token is successfully set */
  onTokenSet?: () => void;
}

export function AdminTokenInput({ variant = "full", onTokenSet }: AdminTokenInputProps) {
  const [input, setInput] = useState("");
  const adminToken = useAppStore((s) => s.adminToken);
  const setAdminToken = useAppStore((s) => s.setAdminToken);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      setAdminToken(input.trim());
      setInput("");
      onTokenSet?.();
    }
  };

  // Compact variant - inline input + button
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="password"
          placeholder={adminToken ? "Change token..." : "Enter token"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-40 h-8 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button size="sm" onClick={() => handleSubmit()} disabled={!input.trim()}>
          <Key className="h-3 w-3 mr-1" />
          {adminToken ? "Update" : "Set"}
        </Button>
      </div>
    );
  }

  // Full variant - card with explanation
  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-teal-500/20 p-3">
            <Lock className="h-8 w-8 text-teal-400" />
          </div>
        </div>
        <CardTitle className="text-center text-foreground">Admin Access</CardTitle>
        <CardDescription className="text-center">
          Enter your admin token to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin token"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={!input.trim()}
          >
            <Key className="h-4 w-4 mr-2" />
            Set Admin Token
          </Button>
        </form>
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            Token is stored locally and sent with admin API requests.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
