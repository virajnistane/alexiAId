/**
 * Emotion Coach Page
 *
 * AI-powered coaching sessions to help alexithymic individuals understand and express emotions.
 * Requires a completed emotional awareness assessment before coaching can begin.
 * Passes the user's emotional profile to the coach via dynamic variables.
 *
 * Flow:
 * 1. Assessment required - prompts user to complete and mark a final assessment
 * 2. Landing view - shows emotional profile and start coaching button
 * 3. Iframe view - embedded ToughTongue AI coaching session
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { TTAIIframe } from "@/components/TTAIIframe";
import { buildCoachUrl, buildPersonalityTestUrl, createIframeEventListener, SCENARIOS } from "@/lib/ttai";
import { useAppStore } from "@/lib/store";
import { AlertCircle, MessageCircle, Loader2, Play, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/** Main content component - handles coaching state and iframe events */
function CoachContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showCoach, setShowCoach] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  // Store
  const userPersonalityAssessment = useAppStore((s) => s.userPersonalityAssessment);
  const addCoachSession = useAppStore((s) => s.addCoachSession);
  const addAssessmentSession = useAppStore((s) => s.addAssessmentSession);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);

  const hasAssessment = !!userPersonalityAssessment;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Set up iframe event listener for assessment
  useEffect(() => {
    if (!showAssessment) return;

    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Assessment session started:", event.data.session_id);
        addAssessmentSession(event.data.session_id, {
          scenarioId: SCENARIOS.PERSONALITY_TEST,
          scenario_id: event.data.scenario_id,
          created_at: new Date().toISOString(),
          status: "active",
        });
      },
      onStop: (event) => {
        console.log("Assessment session stopped:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "completed",
        });
      },
      onTerminated: (event) => {
        console.log("Assessment session terminated:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "terminated",
        });
        setShowAssessment(false);
      },
      onSubmit: (event) => {
        console.log("Assessment session data submitted:", event.data.session_id);
        setShowAssessment(false);
      },
      onError: (error) => {
        console.error("Assessment iframe error:", error);
      },
    });

    return cleanup;
  }, [showAssessment, addAssessmentSession, updateSessionDetails]);

  // Set up iframe event listener for coach
  useEffect(() => {
    if (!showCoach) return;

    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Coach session started:", event.data.session_id);
        addCoachSession(event.data.session_id, {
          scenarioId: SCENARIOS.PERSONALITY_COACH,
          scenario_id: event.data.scenario_id,
          created_at: new Date().toISOString(),
          status: "active",
        });
      },
      onStop: (event) => {
        console.log("Coach session stopped:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "completed",
        });
      },
      onTerminated: (event) => {
        console.log("Coach session terminated:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "terminated",
        });
        setShowCoach(false);
      },
      onSubmit: (event) => {
        console.log("Coach session data submitted:", event.data.session_id);
        setShowCoach(false);
      },
      onError: (error) => {
        console.error("Iframe error:", error);
      },
    });

    return cleanup;
  }, [showCoach, addCoachSession, updateSessionDetails]);

  const assessmentUrl = buildPersonalityTestUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
  });

  const iframeUrl = buildCoachUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
    userPersonalityAssessment: userPersonalityAssessment || undefined,
  });

  if (isLoading) {
    return <LoadingView />;
  }

  if (showAssessment) {
    return (
      <AssessmentIframeView
        iframeUrl={assessmentUrl}
        onEndSession={() => setShowAssessment(false)}
      />
    );
  }

  if (!hasAssessment) {
    return <AssessmentRequiredView onStartAssessment={() => setShowAssessment(true)} />;
  }

  if (showCoach) {
    return (
      <CoachIframeView
        iframeUrl={iframeUrl}
        onEndSession={() => setShowCoach(false)}
      />
    );
  }

  return (
    <CoachLandingView
      personalityAssessment={userPersonalityAssessment}
      onStartCoach={() => setShowCoach(true)}
    />
  );
}

export default function CoachPage() {
  return (
    <AuthGuard title="Sign In for Coaching" description="Sign in to access personalized emotion coaching support">
      <CoachContent />
    </AuthGuard>
  );
}

// =============================================================================
// Loading View
// =============================================================================

function LoadingView() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-500" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
}

// =============================================================================
// Assessment Required View
// =============================================================================

function AssessmentRequiredView({ onStartAssessment }: { onStartAssessment: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Emotion Coach</h1>
        <p className="text-muted-foreground">
          Talk to your AI coach about understanding and expressing emotions
        </p>
      </div>

      <Card className="max-w-lg w-full bg-card border-yellow-500/30">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
          <CardTitle className="text-yellow-400">Assessment Required</CardTitle>
          <CardDescription>
            To get personalized emotion coaching, you need to complete an emotional awareness assessment first and
            mark it as your final result.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <HowItWorksBox />
          <div className="flex gap-3">
            <Button onClick={onStartAssessment} className="flex-1 bg-teal-600 hover:bg-teal-700">
              <Play className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
            <Link href={ROUTES.RESULTS} className="flex-1">
              <Button variant="outline" className="w-full">
                View Progress
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HowItWorksBox() {
  return (
    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
      <p className="text-sm text-yellow-300/80">
        <strong>How it works:</strong>
        <br />
        1. Take the emotion awareness assessment
        <br />
        2. View and review your progress
        <br />
        3. Click "Mark as Final" on the session you want to use
        <br />
        4. Return here to start emotion coaching
      </p>
    </div>
  );
}

// =============================================================================
// Assessment Iframe View
// =============================================================================

function AssessmentIframeView({
  iframeUrl,
  onEndSession,
}: {
  iframeUrl: string;
  onEndSession: () => void;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emotion Awareness Assessment</h1>
          <p className="text-muted-foreground text-sm">
            Share your experiences to build emotional understanding
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onEndSession}>
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
// Coach Iframe View
// =============================================================================

function CoachIframeView({
  iframeUrl,
  onEndSession,
}: {
  iframeUrl: string;
  onEndSession: () => void;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Emotion Coach</h1>
          <p className="text-muted-foreground text-sm">
            Talk to your AI coach about understanding and expressing emotions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onEndSession}>
          End Session
        </Button>
      </div>

      <div className="flex-1 container mx-auto px-4 pb-4">
        <TTAIIframe src={iframeUrl} />
      </div>
    </div>
  );
}

// =============================================================================
// Coach Landing View
// =============================================================================

function CoachLandingView({
  personalityAssessment,
  onStartCoach,
}: {
  personalityAssessment: string | null;
  onStartCoach: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Your Emotion Coach"
        description="Get personalized support in understanding and expressing your emotions"
      />

      <PersonalityProfileCard assessment={personalityAssessment} />

      <Card className="max-w-lg mx-auto bg-card border-border">
        <CardHeader className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-teal-400 mb-4" />
          <CardTitle>Ready to Start Coaching?</CardTitle>
          <CardDescription>
            Your AI coach understands your emotional profile and will provide tailored guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={onStartCoach} size="lg" className="bg-teal-600 hover:bg-teal-700">
            <Play className="h-5 w-5 mr-2" />
            Start Coach Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalityProfileCard({ assessment }: { assessment: string | null }) {
  if (!assessment) return null;

  return (
    <Card className="mb-6 border-teal-500/30 bg-teal-500/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <CardTitle className="text-teal-400">Your Emotion Awareness Profile</CardTitle>
        </div>
        <CardDescription className="text-teal-300/80">
          Your coach will use this to provide personalized guidance on understanding emotions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">{assessment}</p>
      </CardContent>
    </Card>
  );
}
