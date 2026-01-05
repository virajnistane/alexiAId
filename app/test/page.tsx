/**
 * Emotion Assessment Page
 *
 * Allows users to assess their emotional awareness and recognition via ToughTongue AI iframe.
 * Handles session lifecycle events (start, stop, submit, terminate) and stores
 * session data in the Zustand store.
 *
 * Flow:
 * 1. Landing view - prompt to start or view existing progress
 * 2. Iframe view - embedded ToughTongue AI assessment
 * 3. Completion view - success message with link to results
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { TTAIIframe } from "@/components/TTAIIframe";
import { buildPersonalityTestUrl, createIframeEventListener, SCENARIOS } from "@/lib/ttai";
import { useAppStore } from "@/lib/store";
import { ROUTES } from "@/lib/constants";
import { CheckCircle2, Play, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

/** Main content component - handles test state and iframe events */
function TestContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [showTest, setShowTest] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Store
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const addAssessmentSession = useAppStore((s) => s.addAssessmentSession);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);

  const hasExistingSessions = assessmentSessions.length > 0;

  // Set up iframe event listener
  useEffect(() => {
    if (!showTest) return;

    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Session started:", event.data.session_id);
        addAssessmentSession(event.data.session_id, {
          scenarioId: SCENARIOS.PERSONALITY_TEST,
          scenario_id: event.data.scenario_id,
          created_at: new Date().toISOString(),
          status: "active",
        });
      },
      onStop: (event) => {
        console.log("Session stopped:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "completed",
        });
      },
      onTerminated: (event) => {
        console.log("Session terminated:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "terminated",
        });
        setShowTest(false);
        setTestCompleted(true);
      },
      onSubmit: (event) => {
        console.log("Session data submitted:", event.data.session_id);
        setShowTest(false);
        setTestCompleted(true);
      },
      onError: (error) => {
        console.error("Iframe error:", error);
      },
    });

    return cleanup;
  }, [showTest, addAssessmentSession, updateSessionDetails]);

  const iframeUrl = buildPersonalityTestUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
  });

  if (testCompleted) {
    return (
      <TestCompletedView
        onRetake={() => {
          setTestCompleted(false);
          setShowTest(true);
        }}
      />
    );
  }

  if (showTest) {
    return <TestIframeView iframeUrl={iframeUrl} onCancel={() => setShowTest(false)} />;
  }

  return (
    <TestLandingView
      hasExistingSessions={hasExistingSessions}
      sessionCount={assessmentSessions.length}
      onStartTest={() => setShowTest(true)}
    />
  );
}

export default function TestPage() {
  return (
    <AuthGuard
      title="Sign In to Begin Your Journey"
      description="Create an account to track your emotional awareness progress"
    >
      <TestContent />
    </AuthGuard>
  );
}

// =============================================================================
// Test Completed View
// =============================================================================

function TestCompletedView({ onRetake }: { onRetake: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg w-full bg-card border-green-500/30">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-400 mb-4" />
          <CardTitle className="text-2xl text-green-400">Assessment Completed!</CardTitle>
          <CardDescription className="text-green-300/80">
            Your session has been recorded. View your progress to track your emotional awareness journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href={ROUTES.RESULTS}>
            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              View My Progress
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" onClick={onRetake}>
            Take Another Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Test Iframe View
// =============================================================================

function TestIframeView({ iframeUrl, onCancel }: { iframeUrl: string; onCancel: () => void }) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emotion Awareness Assessment</h1>
          <p className="text-muted-foreground text-sm">
            Share your experiences to build emotional understanding
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="flex-1 container mx-auto px-4 pb-4">
        <TTAIIframe src={iframeUrl} />
      </div>
    </div>
  );
}

// =============================================================================
// Test Landing View
// =============================================================================

function TestLandingView({
  hasExistingSessions,
  sessionCount,
  onStartTest,
}: {
  hasExistingSessions: boolean;
  sessionCount: number;
  onStartTest: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Emotion Awareness Assessment"
        description="Build your emotional vocabulary and recognition skills with AI-powered support"
      />

      <Card className="max-w-lg mx-auto bg-card border-border">
        <CardHeader className="text-center">
          <Brain className="mx-auto h-12 w-12 text-teal-400 mb-4" />
          <CardTitle className="text-xl">
            {hasExistingSessions
              ? "Continue Your Journey"
              : "Ready to Understand Your Emotions?"}
          </CardTitle>
          <CardDescription>
            {hasExistingSessions
              ? `You have ${sessionCount} previous session${
                  sessionCount > 1 ? "s" : ""
                }. Start a new assessment or view your progress.`
              : "Have a conversation with our AI to learn about emotional awareness and expression"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={onStartTest} size="lg" className="w-full bg-teal-600 hover:bg-teal-700">
            <Play className="h-5 w-5 mr-2" />
            {hasExistingSessions ? "Start New Assessment" : "Begin Assessment"}
          </Button>
          {hasExistingSessions ? (
            <Link href={ROUTES.RESULTS}>
              <Button variant="outline" className="w-full">
                View My Progress
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
