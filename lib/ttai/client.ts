/**
 * ToughTongue AI - Client-Side Utilities
 *
 * Client-side utilities for embedding ToughTongue AI scenarios
 * and handling iframe communication.
 */

import type {
  EmbedUrlOptions,
  IframeEventData,
  IframeStartEvent,
  IframeStopEvent,
  IframeTerminatedEvent,
  IframeSubmitEvent,
} from "./types";
import { TOUGHTONGUE_ORIGIN, TOUGHTONGUE_EMBED_BASE, SCENARIOS } from "./constants";

// =============================================================================
// Embed URL Builder
// =============================================================================

/**
 * Builds an embed URL for a ToughTongue AI scenario
 */
export function buildEmbedUrl(options: EmbedUrlOptions): string {
  const { scenarioId, background, userName, userEmail, promptUserInfo, dynamicVariables, accessToken } = options;

  const url = new URL(`${TOUGHTONGUE_EMBED_BASE}/${scenarioId}`);

  if (background) {
    url.searchParams.set("bg", background);
  }
  if (userName) {
    url.searchParams.set("userName", userName);
  }
  if (userEmail) {
    url.searchParams.set("userEmail", userEmail);
  }
  if (promptUserInfo && !userName) {
    url.searchParams.set("promptUserInfo", "true");
  }
  if (accessToken) {
    url.searchParams.set("sat", accessToken);
  }
  if (dynamicVariables) {
    Object.entries(dynamicVariables).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

/**
 * Builds embed URL for personality test scenario
 */
export function buildPersonalityTestUrl(options: {
  userName?: string;
  userEmail?: string;
}): string {
  return buildEmbedUrl({
    scenarioId: SCENARIOS.PERSONALITY_TEST,
    background: "black",
    userName: options.userName,
    userEmail: options.userEmail,
    promptUserInfo: !options.userName,
  });
}

/**
 * Builds embed URL for personality coach scenario
 */
export function buildCoachUrl(options: {
  userName?: string;
  userEmail?: string;
  userPersonalityAssessment?: string;
}): string {
  return buildEmbedUrl({
    scenarioId: SCENARIOS.PERSONALITY_COACH,
    background: "black",
    userName: options.userName,
    userEmail: options.userEmail,
    dynamicVariables: options.userPersonalityAssessment
      ? { t_user_personality_assessment: options.userPersonalityAssessment }
      : undefined,
  });
}

// =============================================================================
// Iframe Event Handler
// =============================================================================

type EventCallback<T> = (event: T) => void;

interface IframeEventHandlers {
  /** Called when a session begins (agent is connected) */
  onStart?: EventCallback<IframeStartEvent>;
  /** Called when a session ends normally */
  onStop?: EventCallback<IframeStopEvent>;
  /** Called when a session is terminated (e.g., max duration reached) */
  onTerminated?: EventCallback<IframeTerminatedEvent>;
  /** Called when post-session data submission is completed */
  onSubmit?: EventCallback<IframeSubmitEvent>;
  /** Called on errors */
  onError?: (error: { code: string; message: string }) => void;
  /** Called when the iframe is ready */
  onReady?: (scenarioId: string) => void;
}

/**
 * Normalizes different event payload formats from ToughTongue iframe
 *
 * The API can send events in different formats:
 * - Format A: { event: 'onStart', sessionId: '...', timestamp: 123 }
 * - Format B: { type: 'onStart', data: { session_id: '...', ... } }
 */
function normalizeEventPayload(rawData: Record<string, unknown>): {
  eventType: string;
  data: IframeEventData;
} | null {
  // Format A: { event: 'onStart', sessionId: '...', timestamp: 123 }
  if (rawData.event && typeof rawData.event === "string") {
    return {
      eventType: rawData.event,
      data: {
        session_id: (rawData.sessionId as string) || (rawData.session_id as string) || "",
        scenario_id: rawData.scenarioId as string | undefined,
        duration_seconds: rawData.duration_seconds as number | undefined,
        timestamp: typeof rawData.timestamp === "number" ? rawData.timestamp : Date.now(),
      },
    };
  }

  // Format B: { type: 'onStart', data: { session_id: '...', ... } }
  if (rawData.type && typeof rawData.type === "string") {
    const nestedData = (rawData.data as Record<string, unknown>) || {};
    return {
      eventType: rawData.type,
      data: {
        session_id: (nestedData.session_id as string) || "",
        scenario_id: nestedData.scenario_id as string | undefined,
        duration_seconds: nestedData.duration_seconds as number | undefined,
        timestamp:
          typeof nestedData.timestamp === "number"
            ? nestedData.timestamp
            : typeof nestedData.timestamp === "string"
            ? new Date(nestedData.timestamp).getTime()
            : Date.now(),
      },
    };
  }

  return null;
}

/**
 * Creates a message event listener for ToughTongue iframe events
 *
 * Events emitted:
 * - onStart: When a session begins (agent is connected)
 * - onStop: When a session ends (agent is disconnected)
 * - onTerminated: When session is terminated (e.g., max duration)
 * - onSubmit: When post-session data submission is completed
 *
 * @returns Cleanup function to remove the listener
 */
export function createIframeEventListener(handlers: IframeEventHandlers): () => void {
  const handleMessage = (event: MessageEvent) => {
    // Only accept messages from ToughTongue origin
    if (event.origin !== TOUGHTONGUE_ORIGIN) return;

    const rawData = event.data as Record<string, unknown>;
    if (!rawData || typeof rawData !== "object") return;

    // Handle error events separately (they have a different structure)
    if (rawData.type === "onError" || rawData.event === "onError") {
      const errorData =
        (rawData.data as { code: string; message: string }) ||
        ({ code: "unknown", message: String(rawData.message || "Unknown error") } as {
          code: string;
          message: string;
        });
      handlers.onError?.(errorData);
      return;
    }

    // Handle ready events
    if (rawData.type === "onReady" || rawData.event === "onReady") {
      const scenarioId =
        (rawData.data as { scenario_id?: string })?.scenario_id ||
        (rawData.scenarioId as string) ||
        "";
      handlers.onReady?.(scenarioId);
      return;
    }

    // Normalize the event payload
    const normalized = normalizeEventPayload(rawData);
    if (!normalized) return;

    const { eventType, data } = normalized;

    switch (eventType) {
      case "onStart":
        handlers.onStart?.({ type: "onStart", data });
        break;
      case "onStop":
        handlers.onStop?.({ type: "onStop", data });
        break;
      case "onTerminated":
        handlers.onTerminated?.({ type: "onTerminated", data });
        break;
      case "onSubmit":
        handlers.onSubmit?.({ type: "onSubmit", data });
        break;
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}

// =============================================================================
// MBTI Type Extraction
// =============================================================================

const MBTI_PATTERN =
  /\b(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/i;

/**
 * Extracts MBTI type from analysis data
 */
export function extractMBTIType(analysisData: unknown): string | undefined {
  const text = JSON.stringify(analysisData).toUpperCase();
  const match = text.match(MBTI_PATTERN);
  return match ? match[1] : undefined;
}
