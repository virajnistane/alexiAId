/**
 * Results Page
 *
 * Displays personality assessment results and session history.
 * Users can view, fetch, analyze, and mark sessions as their final assessment.
 *
 * Features:
 * - Session listing with status indicators
 * - Session detail fetching from API
 * - AI-powered session analysis
 * - Personality type and dimension display
 * - Transcript viewing
 * - Mark session as final assessment for coaching
 */

"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ErrorCard, LoadingCard } from "@/components/StatusCards";
import { useAppStore, type SessionDetails, type ReportCardItem } from "@/lib/store";
import { ROUTES } from "@/lib/constants";
import {
  FileText,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle,
  Play,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  User,
  Star,
} from "lucide-react";
import Link from "next/link";

// =============================================================================
// Constants
// =============================================================================

const DIMENSION_LABELS: Record<string, { label: string; description: string }> = {
  extraversion_introversion: {
    label: "Energy Direction",
    description: "Where you focus your attention and get energy",
  },
  sensing_intuition: {
    label: "Information Processing",
    description: "How you prefer to take in information",
  },
  thinking_feeling: {
    label: "Decision Making",
    description: "How you prefer to make decisions",
  },
  judging_perceiving: {
    label: "Lifestyle Orientation",
    description: "How you prefer to organize your life",
  },
  personality_assessment: {
    label: "Your Personality Type",
    description: "Your overall MBTI type based on all dimensions",
  },
};

// =============================================================================
// Utility Functions
// =============================================================================

/** Builds a summary paragraph from the evaluation report card for coaching context */
function buildAssessmentSummary(reportCard: ReportCardItem[]): string {
  const typeItem = reportCard.find((item) => item.topic === "personality_assessment");
  const dimensions = reportCard.filter((item) => item.topic !== "personality_assessment");

  if (!typeItem) return "";

  const type = typeItem.score_str;
  const dimensionSummary = dimensions
    .map((d) => {
      const label = DIMENSION_LABELS[d.topic]?.label || d.topic;
      return `${label}: ${d.score_str}`;
    })
    .join(". ");

  return `The user's MBTI personality has been assessed as ${type}. ${dimensionSummary}. ${
    typeItem.note?.split("\n")[0] || ""
  }`;
}

function getPersonalityData(reportCard?: ReportCardItem[]) {
  if (!reportCard) return { type: null, typeNote: null, dimensions: [] };

  const typeItem = reportCard.find((item) => item.topic === "personality_assessment");
  const dimensions = reportCard.filter((item) => item.topic !== "personality_assessment");

  return {
    type: typeItem?.score_str || null,
    typeNote: typeItem?.note || null,
    dimensions,
  };
}

function formatDuration(seconds?: number) {
  if (!seconds) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
}

// =============================================================================
// Main Component
// =============================================================================

function ResultsContent() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Store
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const sessionDetails = useAppStore((s) => s.sessionDetails);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);
  const userPersonalitySessionId = useAppStore((s) => s.userPersonalitySessionId);
  const setUserPersonalityAssessment = useAppStore((s) => s.setUserPersonalityAssessment);

  const selectedSession = selectedSessionId ? sessionDetails[selectedSessionId] : null;

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchSession = async (sessionId: string) => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch session");
      }

      const data = await response.json();
      updateSessionDetails(sessionId, {
        scenario_id: data.scenario_id,
        scenario_name: data.scenario_name,
        status: data.status,
        created_at: data.created_at,
        completed_at: data.completed_at,
        user_name: data.user_name,
        user_email: data.user_email,
        duration: data.duration,
        finalized_transcript: data.finalized_transcript || data.transcript_content,
        evaluation_results: data.evaluation_results,
        improvement_results: data.improvement_results,
      });
    } catch (err) {
      console.error("Error fetching session:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch session");
    } finally {
      setIsFetching(false);
    }
  };

  const analyzeSession = async (sessionId: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to analyze session");
      }

      await fetchSession(sessionId);
    } catch (err) {
      console.error("Error analyzing session:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze session");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const markAsFinalAssessment = (sessionId: string) => {
    const session = sessionDetails[sessionId];
    if (!session?.evaluation_results?.report_card) return;

    const typeItem = session.evaluation_results.report_card.find(
      (item) => item.topic === "personality_assessment"
    );
    const mbtiType = typeItem?.score_str || null;
    const summary = buildAssessmentSummary(session.evaluation_results.report_card);
    setUserPersonalityAssessment(mbtiType, summary, sessionId);
  };

  // Empty state
  if (assessmentSessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Results" description="View your personality assessment results" />
        <EmptyState
          icon={FileText}
          title="No Sessions Yet"
          description="Take a personality test to see your results here"
        >
          <Link href={ROUTES.TEST}>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Play className="h-4 w-4 mr-2" />
              Take the Test
            </Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Results" description="View your personality assessment results" />

      <SessionsTable
        sessions={assessmentSessions}
        sessionDetails={sessionDetails}
        selectedSessionId={selectedSessionId}
        userPersonalitySessionId={userPersonalitySessionId}
        copiedId={copiedId}
        isFetching={isFetching}
        onSelectSession={setSelectedSessionId}
        onFetchSession={fetchSession}
        onCopyId={copyToClipboard}
      />

      {error ? <ErrorCard message={error} /> : null}
      {isFetching ? <LoadingCard message="Fetching Session..." /> : null}

      {selectedSessionId && selectedSession ? (
        <SessionDetailsView
          sessionId={selectedSessionId}
          session={selectedSession}
          userPersonalitySessionId={userPersonalitySessionId}
          isAnalyzing={isAnalyzing}
          transcriptOpen={transcriptOpen}
          onAnalyze={() => analyzeSession(selectedSessionId)}
          onMarkAsFinal={() => markAsFinalAssessment(selectedSessionId)}
          onToggleTranscript={() => setTranscriptOpen(!transcriptOpen)}
        />
      ) : selectedSessionId ? (
        <EmptyState
          icon={FileText}
          title="Session Not Loaded"
          description='Click "Fetch" to load session details'
        />
      ) : null}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <AuthGuard
      title="Sign In to View Results"
      description="Sign in to view your personality test results"
    >
      <ResultsContent />
    </AuthGuard>
  );
}

// =============================================================================
// Sessions Table
// =============================================================================

/** Displays a table of assessment sessions with selection and fetch controls */
function SessionsTable({
  sessions,
  sessionDetails,
  selectedSessionId,
  userPersonalitySessionId,
  copiedId,
  isFetching,
  onSelectSession,
  onFetchSession,
  onCopyId,
}: {
  sessions: string[];
  sessionDetails: Record<string, SessionDetails>;
  selectedSessionId: string | null;
  userPersonalitySessionId: string | null;
  copiedId: string | null;
  isFetching: boolean;
  onSelectSession: (id: string) => void;
  onFetchSession: (id: string) => void;
  onCopyId: (id: string) => void;
}) {
  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
        <CardDescription>
          {sessions.length} session{sessions.length > 1 ? "s" : ""} recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                  Session ID
                </th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Created</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Duration</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((id) => {
                const details = sessionDetails[id];
                const isSelected = selectedSessionId === id;
                const isAnalyzed = !!details?.evaluation_results;
                const isFinal = userPersonalitySessionId === id;

                return (
                  <SessionRow
                    key={id}
                    id={id}
                    details={details}
                    isSelected={isSelected}
                    isAnalyzed={isAnalyzed}
                    isFinal={isFinal}
                    copiedId={copiedId}
                    isFetching={isFetching}
                    onSelect={() => onSelectSession(id)}
                    onFetch={() => {
                      onSelectSession(id);
                      onFetchSession(id);
                    }}
                    onCopy={() => onCopyId(id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionRow({
  id,
  details,
  isSelected,
  isAnalyzed,
  isFinal,
  copiedId,
  isFetching,
  onSelect,
  onFetch,
  onCopy,
}: {
  id: string;
  details?: SessionDetails;
  isSelected: boolean;
  isAnalyzed: boolean;
  isFinal: boolean;
  copiedId: string | null;
  isFetching: boolean;
  onSelect: () => void;
  onFetch: () => void;
  onCopy: () => void;
}) {
  return (
    <tr
      className={`border-b border-border/50 cursor-pointer hover:bg-muted/50 ${
        isSelected ? "bg-purple-500/10" : ""
      }`}
      onClick={onSelect}
    >
      <td className="py-2 px-2">
        <div className="flex items-center gap-2">
          {isFinal ? <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> : null}
          <code className="text-xs font-mono break-all">{id}</code>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
          >
            {copiedId === id ? (
              <CheckCircle className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </td>
      <td className="py-2 px-2 text-muted-foreground">
        {details?.created_at ? formatDate(details.created_at) : "-"}
      </td>
      <td className="py-2 px-2 text-muted-foreground">{formatDuration(details?.duration)}</td>
      <td className="py-2 px-2">
        <SessionStatus isFinal={isFinal} isAnalyzed={isAnalyzed} />
      </td>
      <td className="py-2 px-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onFetch();
          }}
          disabled={isFetching}
        >
          <Download className="h-3 w-3 mr-1" />
          Fetch
        </Button>
      </td>
    </tr>
  );
}

function SessionStatus({ isFinal, isAnalyzed }: { isFinal: boolean; isAnalyzed: boolean }) {
  if (isFinal) {
    return (
      <span className="flex items-center gap-1 text-yellow-400">
        <Star className="h-3 w-3 fill-yellow-400" />
        Final
      </span>
    );
  }
  if (isAnalyzed) {
    return (
      <span className="flex items-center gap-1 text-green-400">
        <CheckCircle className="h-4 w-4" />
        Analyzed
      </span>
    );
  }
  return <span className="text-muted-foreground">Pending</span>;
}

// =============================================================================
// Session Details View
// =============================================================================

function SessionDetailsView({
  sessionId,
  session,
  userPersonalitySessionId,
  isAnalyzing,
  transcriptOpen,
  onAnalyze,
  onMarkAsFinal,
  onToggleTranscript,
}: {
  sessionId: string;
  session: SessionDetails;
  userPersonalitySessionId: string | null;
  isAnalyzing: boolean;
  transcriptOpen: boolean;
  onAnalyze: () => void;
  onMarkAsFinal: () => void;
  onToggleTranscript: () => void;
}) {
  const isFinal = userPersonalitySessionId === sessionId;

  return (
    <div className="space-y-6">
      <SessionInfoCard
        sessionId={sessionId}
        session={session}
        isFinal={isFinal}
        isAnalyzing={isAnalyzing}
        onAnalyze={onAnalyze}
        onMarkAsFinal={onMarkAsFinal}
      />

      {session.evaluation_results?.report_card ? (
        <PersonalityResultsSection reportCard={session.evaluation_results.report_card} />
      ) : null}

      <StrengthsWeaknessesSection evaluationResults={session.evaluation_results} />

      {session.finalized_transcript ? (
        <TranscriptAccordion
          transcript={session.finalized_transcript}
          isOpen={transcriptOpen}
          onToggle={onToggleTranscript}
        />
      ) : null}

      <RawDataCard data={session} />
    </div>
  );
}

// =============================================================================
// Session Info Card
// =============================================================================

/** Displays session metadata with analyze and mark-as-final actions */
function SessionInfoCard({
  sessionId,
  session,
  isFinal,
  isAnalyzing,
  onAnalyze,
  onMarkAsFinal,
}: {
  sessionId: string;
  session: SessionDetails;
  isFinal: boolean;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onMarkAsFinal: () => void;
}) {
  const hasReportCard = !!session.evaluation_results?.report_card;
  const needsAnalysis = !session.evaluation_results;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Session Details</CardTitle>
            <CardDescription className="font-mono text-xs mt-1">{sessionId}</CardDescription>
          </div>
          <div className="flex gap-2">
            {hasReportCard ? (
              <Button
                onClick={onMarkAsFinal}
                variant={isFinal ? "secondary" : "outline"}
                disabled={isFinal}
              >
                <Star
                  className={`h-4 w-4 mr-2 ${isFinal ? "fill-yellow-400 text-yellow-400" : ""}`}
                />
                {isFinal ? "Final Assessment" : "Mark as Final"}
              </Button>
            ) : null}
            {needsAnalysis ? (
              <Button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Session
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <InfoItem label="User" value={session.user_name || "-"} />
          <InfoItem label="Duration" value={formatDuration(session.duration)} />
          <InfoItem label="Status" value={session.status || "-"} capitalize />
          <InfoItem
            label="Completed"
            value={session.completed_at ? new Date(session.completed_at).toLocaleDateString() : "-"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className={`font-medium text-foreground ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

// =============================================================================
// Personality Results Section
// =============================================================================

function PersonalityResultsSection({ reportCard }: { reportCard: ReportCardItem[] }) {
  const { type, typeNote, dimensions } = getPersonalityData(reportCard);

  return (
    <>
      {type ? <PersonalityTypeCard type={type} typeNote={typeNote} /> : null}
      {dimensions.length > 0 ? <DimensionsCard dimensions={dimensions} /> : null}
    </>
  );
}

function PersonalityTypeCard({ type, typeNote }: { type: string; typeNote: string | null }) {
  return (
    <Card className="bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border-purple-500/30">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-purple-500/20 flex items-center justify-center">
          <User className="h-10 w-10 text-purple-400" />
        </div>
        <CardTitle className="text-4xl font-bold text-purple-400">{type}</CardTitle>
        <CardDescription className="text-lg mt-2">Your Personality Type</CardDescription>
      </CardHeader>
      {typeNote ? (
        <CardContent>
          <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
            {typeNote.split("\n")[0].replace(/^Based on the conversation, /, "")}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}

function DimensionsCard({ dimensions }: { dimensions: ReportCardItem[] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Your Personality Dimensions</CardTitle>
        <CardDescription>How you scored across the four MBTI dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {dimensions.map((item) => (
            <DimensionItem key={item.topic} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DimensionItem({ item }: { item: ReportCardItem }) {
  const info = DIMENSION_LABELS[item.topic] || { label: item.topic, description: "" };

  return (
    <div className="p-4 rounded-lg bg-background border border-border">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-muted-foreground">{info.label}</p>
          <p className="text-xl font-semibold text-purple-400">{item.score_str}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{info.description}</p>
      <details className="mt-3">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          View details
        </summary>
        <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
      </details>
    </div>
  );
}

// =============================================================================
// Strengths & Weaknesses Section
// =============================================================================

/** Displays strengths and areas for growth from evaluation results */
function StrengthsWeaknessesSection({
  evaluationResults,
}: {
  evaluationResults?: SessionDetails["evaluation_results"];
}) {
  if (!evaluationResults?.strengths && !evaluationResults?.weaknesses) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {evaluationResults.strengths ? (
        <FeedbackCard
          title="Key Strengths"
          content={evaluationResults.strengths}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
      ) : null}
      {evaluationResults.weaknesses ? (
        <FeedbackCard
          title="Areas for Growth"
          content={evaluationResults.weaknesses}
          icon={<AlertCircle className="h-5 w-5" />}
          color="orange"
        />
      ) : null}
    </div>
  );
}

function FeedbackCard({
  title,
  content,
  icon,
  color,
}: {
  title: string;
  content: string;
  icon: React.ReactNode;
  color: "green" | "orange";
}) {
  const colorClass = color === "green" ? "text-green-400" : "text-orange-400";
  const formattedContent = content
    .replace(/####.*?\n/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/- /g, "• ")
    .trim();

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${colorClass}`}>
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{formattedContent}</div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Transcript Accordion
// =============================================================================

function TranscriptAccordion({
  transcript,
  isOpen,
  onToggle,
}: {
  transcript: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            Conversation Transcript
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Click to {isOpen ? "collapse" : "expand"}
          </span>
        </div>
      </CardHeader>
      {isOpen ? (
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {transcript.split("\n\n").map((line, i) => (
              <TranscriptLine key={i} line={line} />
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

function TranscriptLine({ line }: { line: string }) {
  const isAI = line.includes("] AI:");
  const isUser = line.includes("] User:");
  if (!isAI && !isUser) return null;

  const match = line.match(/\[(.*?)\] (AI|User): (.*)/);
  if (!match) return null;

  const [, timestamp, role, content] = match;

  return (
    <div
      className={`p-3 rounded-lg text-sm ${
        isAI ? "bg-purple-500/10 border border-purple-500/20" : "bg-background border border-border"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-medium ${isAI ? "text-purple-400" : "text-muted-foreground"}`}>
          {role === "AI" ? "Dr. Sarah Chen" : "You"}
        </span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
      <p className="text-foreground">{content}</p>
    </div>
  );
}

// =============================================================================
// Raw Data Card
// =============================================================================

/** Expandable card showing raw JSON session data for debugging */
function RawDataCard({ data }: { data: SessionDetails }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Raw Data</CardTitle>
      </CardHeader>
      <CardContent>
        <details>
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            View raw JSON
          </summary>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-4 text-xs text-muted-foreground border border-border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
