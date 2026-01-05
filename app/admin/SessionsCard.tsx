/**
 * Sessions Card Component
 *
 * Displays a table of recent sessions with filtering by scenario type.
 * Allows selecting sessions for analysis and copying session IDs.
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SCENARIOS, type SessionListItem } from "@/lib/ttai";
import { RefreshCw, Loader2, Clock, FileText, Check, Copy } from "lucide-react";
import { formatDuration, formatDate, getStatusColor, getStatusIcon } from "./utils";

interface SessionsCardProps {
  /** List of sessions to display */
  sessions: SessionListItem[];
  /** Whether sessions are currently being fetched */
  isLoading: boolean;
  /** Currently selected session ID */
  selectedSession: string | null;
  /** Currently selected scenario filter */
  selectedScenario: string;
  /** ID of the session whose ID was just copied */
  copiedId: string | null;
  /** Whether an analysis is in progress */
  isAnalyzing: boolean;
  /** Callback to refresh sessions */
  onRefresh: () => void;
  /** Callback when a session is selected */
  onSelectSession: (id: string) => void;
  /** Callback when scenario filter changes */
  onSelectScenario: (id: string) => void;
  /** Callback to copy a session ID */
  onCopyId: (id: string, e: React.MouseEvent) => void;
  /** Callback to trigger analysis */
  onAnalyze: () => void;
}

export function SessionsCard({
  sessions,
  isLoading,
  selectedSession,
  selectedScenario,
  copiedId,
  isAnalyzing,
  onRefresh,
  onSelectSession,
  onSelectScenario,
  onCopyId,
  onAnalyze,
}: SessionsCardProps) {
  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader>
        <SessionsCardHeader
          selectedScenario={selectedScenario}
          isLoading={isLoading}
          onSelectScenario={onSelectScenario}
          onRefresh={onRefresh}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <SessionsTable
            sessions={sessions}
            selectedSession={selectedSession}
            copiedId={copiedId}
            onSelect={onSelectSession}
            onCopy={onCopyId}
          />
        )}

        {sessions.length > 0 ? (
          <SessionsFooter
            sessionCount={sessions.length}
            selectedSession={selectedSession}
            isAnalyzing={isAnalyzing}
            onAnalyze={onAnalyze}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

/** Header with title and scenario selector dropdown */
function SessionsCardHeader({
  selectedScenario,
  isLoading,
  onSelectScenario,
  onRefresh,
}: {
  selectedScenario: string;
  isLoading: boolean;
  onSelectScenario: (id: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <CardTitle>Sessions (Last 30 Days)</CardTitle>
        <CardDescription>View sessions for a specific scenario</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={selectedScenario}
          onChange={(e) => onSelectScenario(e.target.value)}
          className="h-9 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        >
          <option value={SCENARIOS.PERSONALITY_TEST}>Personality Test</option>
          <option value={SCENARIOS.PERSONALITY_COACH}>Personality Coach</option>
        </select>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}

/** Loading spinner state */
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      Loading sessions...
    </div>
  );
}

/** Empty state when no sessions found */
function EmptyState() {
  return <div className="text-center py-8 text-muted-foreground">No sessions found</div>;
}

/** Table displaying all sessions */
function SessionsTable({
  sessions,
  selectedSession,
  copiedId,
  onSelect,
  onCopy,
}: {
  sessions: SessionListItem[];
  selectedSession: string | null;
  copiedId: string | null;
  onSelect: (id: string) => void;
  onCopy: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Select</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Session ID</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">User</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              Duration
            </th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              isSelected={selectedSession === session.id}
              isCopied={copiedId === session.id}
              onSelect={() => onSelect(session.id)}
              onCopy={(e) => onCopy(session.id, e)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Individual session row in the table */
function SessionRow({
  session,
  isSelected,
  isCopied,
  onSelect,
  onCopy,
}: {
  session: SessionListItem;
  isSelected: boolean;
  isCopied: boolean;
  onSelect: () => void;
  onCopy: (e: React.MouseEvent) => void;
}) {
  const StatusIcon = getStatusIcon(session.status);

  return (
    <tr
      className={`border-b border-border/50 hover:bg-muted/30 cursor-pointer ${
        isSelected ? "bg-teal-500/10" : ""
      }`}
      onClick={onSelect}
    >
      <td className="py-3 px-2">
        <input
          type="radio"
          name="session"
          checked={isSelected}
          onChange={onSelect}
          className="accent-teal-500"
        />
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs">{session.id}</code>
          <button onClick={onCopy} className="p-1 hover:bg-muted rounded">
            {isCopied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
      </td>
      <td className="py-3 px-2">{session.user_name || session.user_email || "-"}</td>
      <td className="py-3 px-2">{formatDuration(session.duration)}</td>
      <td className="py-3 px-2">
        <span className={`flex items-center gap-1 ${getStatusColor(session.status)}`}>
          {StatusIcon ? <StatusIcon className="h-4 w-4" /> : null}
          {session.status}
        </span>
      </td>
      <td className="py-3 px-2 text-muted-foreground">{formatDate(session.created_at)}</td>
    </tr>
  );
}

/** Footer with session count and analyze button */
function SessionsFooter({
  sessionCount,
  selectedSession,
  isAnalyzing,
  onAnalyze,
}: {
  sessionCount: number;
  selectedSession: string | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {sessionCount} session{sessionCount !== 1 ? "s" : ""}
        {selectedSession ? <span className="text-teal-400 ml-2">• Selected</span> : null}
      </p>
      <Button
        onClick={onAnalyze}
        disabled={!selectedSession || isAnalyzing}
        className="bg-teal-600 hover:bg-teal-700"
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FileText className="h-4 w-4 mr-2" />
        )}
        {isAnalyzing ? "Analyzing..." : "Run Analysis"}
      </Button>
    </div>
  );
}
