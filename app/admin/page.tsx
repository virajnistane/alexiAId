/**
 * Admin Dashboard Page
 *
 * Protected admin interface for monitoring ToughTongue AI usage and managing sessions.
 * Features:
 * - Account balance display
 * - Session listing with scenario filtering
 * - Session analysis trigger
 * - Local store editor for debugging
 *
 * Requires NEXT_PUBLIC_IS_DEV=true and a valid admin token.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBanner } from "@/components/StatusCards";
import { AppConfig } from "@/lib/config";
import { SCENARIOS, type SessionListItem, type Balance, type SessionAnalysis } from "@/lib/ttai";
import { useAppStore } from "@/lib/store";
import { ShieldOff, Trash2 } from "lucide-react";

import { AdminTokenInput } from "./AdminTokenInput";
import { BalanceCard } from "./BalanceCard";
import { SessionsCard } from "./SessionsCard";
import { AnalysisResultsCard } from "./AnalysisResultsCard";
import { LocalStoreEditor } from "./LocalStoreEditor";
import { isWithinLast30Days } from "./utils";

export default function AdminPage() {
  const adminToken = useAppStore((s) => s.adminToken);
  const clearAll = useAppStore((s) => s.clearAll);

  const [stats, setStats] = useState<{
    balance: Balance | null;
    sessions: SessionListItem[];
    isLoadingBalance: boolean;
    isLoadingSessions: boolean;
    error: string | null;
  }>({
    balance: null,
    sessions: [],
    isLoadingBalance: false,
    isLoadingSessions: false,
    error: null,
  });

  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SessionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>(SCENARIOS.PERSONALITY_TEST);

  const isAuthenticated = !!adminToken;

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------

  /** Fetches account balance from the API */
  const fetchBalance = useCallback(async () => {
    if (!adminToken) return;
    setStats((prev) => ({ ...prev, isLoadingBalance: true, error: null }));
    try {
      const response = await fetch("/api/balance", {
        headers: { "x-admin-token": adminToken },
      });
      if (!response.ok) {
        throw new Error(response.status === 401 ? "Invalid token" : "Failed to fetch");
      }
      const data = await response.json();
      if (typeof data.available_minutes === "number") {
        setStats((prev) => ({ ...prev, balance: data as Balance, isLoadingBalance: false }));
      }
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        balance: null,
        isLoadingBalance: false,
        error: err instanceof Error ? err.message : "Failed to load balance",
      }));
    }
  }, [adminToken]);

  /** Fetches sessions from the API filtered by selected scenario */
  const fetchSessions = useCallback(async () => {
    if (!adminToken) return;
    setStats((prev) => ({ ...prev, isLoadingSessions: true, error: null }));
    try {
      const response = await fetch(`/api/sessions?scenario_id=${selectedScenario}&limit=100`, {
        headers: { "x-admin-token": adminToken },
      });
      if (!response.ok) {
        throw new Error(response.status === 401 ? "Invalid token" : "Failed to fetch");
      }
      const data = await response.json();
      const recentSessions = (data.sessions || []).filter((s: SessionListItem) =>
        isWithinLast30Days(s.created_at)
      );
      setStats((prev) => ({ ...prev, sessions: recentSessions, isLoadingSessions: false }));
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        isLoadingSessions: false,
        error: err instanceof Error ? err.message : "Failed to load sessions",
      }));
    }
  }, [adminToken, selectedScenario]);

  // Auto-fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchSessions();
    }
  }, [isAuthenticated, fetchBalance, fetchSessions]);

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------

  /** Triggers analysis for the selected session */
  const handleAnalyze = async () => {
    if (!selectedSession || !adminToken) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: selectedSession }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).error || "Analysis failed");
      }
      setAnalysisResult(await response.json());
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /** Copies a session ID to the clipboard */
  const copyToClipboard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Admin disabled in production
  if (!AppConfig.app.isDev) {
    return <AdminDisabledView />;
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <AdminTokenInput variant="full" />
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <AdminHeader onClearState={clearAll} />

      {stats.error ? <ErrorBanner message={stats.error} /> : null}

      <BalanceCard
        balance={stats.balance}
        isLoading={stats.isLoadingBalance}
        onRefresh={fetchBalance}
      />

      <SessionsCard
        sessions={stats.sessions}
        isLoading={stats.isLoadingSessions}
        selectedSession={selectedSession}
        selectedScenario={selectedScenario}
        copiedId={copiedId}
        isAnalyzing={isAnalyzing}
        onRefresh={fetchSessions}
        onSelectSession={setSelectedSession}
        onSelectScenario={setSelectedScenario}
        onCopyId={copyToClipboard}
        onAnalyze={handleAnalyze}
      />

      {analysisResult || analysisError ? (
        <AnalysisResultsCard result={analysisResult} error={analysisError} />
      ) : null}

      <LocalStoreEditor />
    </div>
  );
}

// =============================================================================
// Page-specific Components
// =============================================================================

/**
 * Shown when admin is disabled (production mode).
 * Instructs user to enable NEXT_PUBLIC_IS_DEV.
 */
function AdminDisabledView() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-500/20 p-3">
              <ShieldOff className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-center text-foreground">Admin Disabled</CardTitle>
          <CardDescription className="text-center">
            Set <code className="bg-muted px-1 rounded">NEXT_PUBLIC_IS_DEV=true</code> to enable.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

/**
 * Dashboard header with title, token input, and clear state button.
 */
function AdminHeader({ onClearState }: { onClearState: () => void }) {
  return (
    <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor usage and manage sessions</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <AdminTokenInput variant="compact" />
        <Button variant="destructive" size="sm" onClick={onClearState}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear State
        </Button>
      </div>
    </div>
  );
}
