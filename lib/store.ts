/**
 * Application Store
 *
 * Zustand store with localStorage persistence for user data and sessions.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================================================================
// Types
// =============================================================================

export interface User {
  id: string;
  name: string;
  email?: string;
  type: "local" | "firebase";
  createdAt: string;
}

export interface ReportCardItem {
  topic: string;
  score: number;
  score_str: string;
  note: string;
  weight: number;
}

export interface EvaluationResults {
  overall_score?: string;
  strengths?: string;
  weaknesses?: string;
  detailed_feedback?: string;
  report_card?: ReportCardItem[];
  final_score?: number;
}

export interface ImprovementResults {
  improvement_areas?: string;
  action_items?: string;
  resources?: string;
}

export interface SessionDetails {
  id: string;
  scenarioId: string;
  scenarioType: "assessment" | "coach";
  // From API
  scenario_id?: string;
  scenario_name?: string;
  status?: "active" | "completed" | "cancelled" | "terminated";
  created_at?: string;
  completed_at?: string;
  user_name?: string;
  user_email?: string;
  duration?: number; // seconds
  finalized_transcript?: string;
  evaluation_results?: EvaluationResults;
  improvement_results?: ImprovementResults;
}

export interface AppState {
  // User
  user: User | null;

  // Admin token for sensitive API requests
  adminToken: string | null;

  // User's finalized personality assessment (from a selected session)
  userPersonalityType: string | null; // e.g., "INTP"
  userPersonalityAssessment: string | null; // Full text description
  userPersonalitySessionId: string | null;

  // Session IDs (references)
  assessmentSessions: string[];
  coachSessions: string[];

  // Session details (keyed by sessionId)
  sessionDetails: Record<string, SessionDetails>;
}

export interface AppActions {
  // User actions
  setUser: (user: User | null) => void;

  // Admin token actions
  setAdminToken: (token: string | null) => void;

  // Personality assessment actions
  setUserPersonalityAssessment: (
    type: string | null,
    assessment: string | null,
    sessionId: string | null
  ) => void;

  // Assessment session actions
  addAssessmentSession: (sessionId: string, details?: Partial<SessionDetails>) => void;
  removeAssessmentSession: (sessionId: string) => void;

  // Coach session actions
  addCoachSession: (sessionId: string, details?: Partial<SessionDetails>) => void;
  removeCoachSession: (sessionId: string) => void;

  // Session details actions
  updateSessionDetails: (sessionId: string, details: Partial<SessionDetails>) => void;
  getSessionDetails: (sessionId: string) => SessionDetails | undefined;

  // Bulk operations
  setRawState: (state: Partial<AppState>) => void;
  clearAll: () => void;
}

export type AppStore = AppState & AppActions;

// =============================================================================
// Initial State
// =============================================================================

const initialState: AppState = {
  user: null,
  adminToken: null,
  userPersonalityType: null,
  userPersonalityAssessment: null,
  userPersonalitySessionId: null,
  assessmentSessions: [],
  coachSessions: [],
  sessionDetails: {},
};

// =============================================================================
// Store
// =============================================================================

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User actions
      setUser: (user) => set({ user }),

      // Admin token actions
      setAdminToken: (token) => set({ adminToken: token }),

      // Personality assessment actions
      setUserPersonalityAssessment: (type, assessment, sessionId) =>
        set({
          userPersonalityType: type,
          userPersonalityAssessment: assessment,
          userPersonalitySessionId: sessionId,
        }),

      // Assessment session actions
      addAssessmentSession: (sessionId, details) =>
        set((state) => ({
          assessmentSessions: state.assessmentSessions.includes(sessionId)
            ? state.assessmentSessions
            : [...state.assessmentSessions, sessionId],
          sessionDetails: {
            ...state.sessionDetails,
            [sessionId]: {
              id: sessionId,
              scenarioId: details?.scenarioId || "",
              scenarioType: "assessment",
              ...details,
            },
          },
        })),

      removeAssessmentSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: _, ...restDetails } = state.sessionDetails;
          return {
            assessmentSessions: state.assessmentSessions.filter((id) => id !== sessionId),
            sessionDetails: restDetails,
          };
        }),

      // Coach session actions
      addCoachSession: (sessionId, details) =>
        set((state) => ({
          coachSessions: state.coachSessions.includes(sessionId)
            ? state.coachSessions
            : [...state.coachSessions, sessionId],
          sessionDetails: {
            ...state.sessionDetails,
            [sessionId]: {
              id: sessionId,
              scenarioId: details?.scenarioId || "",
              scenarioType: "coach",
              ...details,
            },
          },
        })),

      removeCoachSession: (sessionId) =>
        set((state) => {
          const { [sessionId]: _, ...restDetails } = state.sessionDetails;
          return {
            coachSessions: state.coachSessions.filter((id) => id !== sessionId),
            sessionDetails: restDetails,
          };
        }),

      // Session details actions
      updateSessionDetails: (sessionId, details) =>
        set((state) => ({
          sessionDetails: {
            ...state.sessionDetails,
            [sessionId]: {
              ...state.sessionDetails[sessionId],
              ...details,
            },
          },
        })),

      getSessionDetails: (sessionId) => get().sessionDetails[sessionId],

      // Bulk operations
      setRawState: (newState) => set((state) => ({ ...state, ...newState })),

      clearAll: () => set(initialState),
    }),
    {
      name: "ttai-app-store",
    }
  )
);

// =============================================================================
// Selectors (for convenience)
// =============================================================================

export const selectUser = (state: AppStore) => state.user;
export const selectAdminToken = (state: AppStore) => state.adminToken;
export const selectAssessmentSessions = (state: AppStore) => state.assessmentSessions;
export const selectCoachSessions = (state: AppStore) => state.coachSessions;
export const selectSessionDetails = (state: AppStore) => state.sessionDetails;

/** Get the latest assessment session details */
export const selectLatestAssessment = (state: AppStore): SessionDetails | undefined => {
  const latestId = state.assessmentSessions[state.assessmentSessions.length - 1];
  return latestId ? state.sessionDetails[latestId] : undefined;
};

/** Check if user has completed an assessment (has evaluation results) */
export const selectHasCompletedAssessment = (state: AppStore): boolean => {
  const latest = selectLatestAssessment(state);
  return !!latest?.evaluation_results;
};
