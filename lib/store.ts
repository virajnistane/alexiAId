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

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // ISO 8601 timestamp
  emotions: string[]; // Array of emotion names
  intensity: 1 | 2 | 3 | 4 | 5; // 1=very low, 5=very high
  situation: string; // What happened
  thoughts: string; // What you were thinking
  bodySensations: string; // Physical sensations
  notes?: string; // Additional notes
  tags?: string[]; // Optional tags for categorization
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  action: "sign_in" | "sign_out" | "start_assessment" | "complete_assessment" | "start_coaching" | "complete_coaching" | "create_journal" | "update_journal" | "delete_journal" | "export_data" | "import_data" | "clear_data";
  details?: string; // Additional context
  metadata?: Record<string, unknown>; // Session IDs, etc.
  timestamp: string;
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

  // Journal entries
  journalEntries: JournalEntry[];

  // Activity logs for admin tracking
  activityLogs: ActivityLog[];
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

  // Journal actions
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  updateJournalEntry: (id: string, updates: Partial<Omit<JournalEntry, "id" | "userId" | "createdAt">>) => void;
  deleteJournalEntry: (id: string) => void;
  getJournalEntry: (id: string) => JournalEntry | undefined;
  getJournalEntriesByDateRange: (startDate: string, endDate: string) => JournalEntry[];

  // Activity tracking actions
  logActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  getActivityLogs: (filters?: { userId?: string; action?: string; startDate?: string; endDate?: string }) => ActivityLog[];
  clearActivityLogs: () => void;

  // Data control actions
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearUserData: (userId: string) => void;

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
  journalEntries: [],
  activityLogs: [],
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

      // Journal actions
      addJournalEntry: (entry) =>
        set((state) => {
          const newEntry: JournalEntry = {
            ...entry,
            id: `journal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            journalEntries: [...state.journalEntries, newEntry],
          };
        }),

      updateJournalEntry: (id, updates) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
        })),

      deleteJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
        })),

      getJournalEntry: (id) => get().journalEntries.find((entry) => entry.id === id),

      getJournalEntriesByDateRange: (startDate, endDate) =>
        get().journalEntries.filter((entry) => {
          const entryDate = new Date(entry.date).getTime();
          const start = new Date(startDate).getTime();
          const end = new Date(endDate).getTime();
          return entryDate >= start && entryDate <= end;
        }),

      // Activity tracking actions
      logActivity: (activity) =>
        set((state) => {
          const newActivity: ActivityLog = {
            ...activity,
            id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
          };
          return {
            activityLogs: [...state.activityLogs, newActivity],
          };
        }),

      getActivityLogs: (filters) => {
        let logs = get().activityLogs;
        
        if (filters?.userId) {
          logs = logs.filter((log) => log.userId === filters.userId);
        }
        if (filters?.action) {
          logs = logs.filter((log) => log.action === filters.action);
        }
        if (filters?.startDate && filters?.endDate) {
          const start = new Date(filters.startDate).getTime();
          const end = new Date(filters.endDate).getTime();
          logs = logs.filter((log) => {
            const logTime = new Date(log.timestamp).getTime();
            return logTime >= start && logTime <= end;
          });
        }
        
        return logs.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      },

      clearActivityLogs: () =>
        set((state) => ({
          activityLogs: [],
        })),

      // Data control actions
      exportData: () => {
        const state = get();
        const exportData = {
          version: "1.0",
          exportDate: new Date().toISOString(),
          data: {
            user: state.user,
            userPersonalityType: state.userPersonalityType,
            userPersonalityAssessment: state.userPersonalityAssessment,
            userPersonalitySessionId: state.userPersonalitySessionId,
            assessmentSessions: state.assessmentSessions,
            coachSessions: state.coachSessions,
            sessionDetails: state.sessionDetails,
            journalEntries: state.journalEntries,
          },
        };
        return JSON.stringify(exportData, null, 2);
      },

      importData: (jsonData) => {
        try {
          const parsed = JSON.parse(jsonData);
          if (!parsed.data || !parsed.version) {
            console.error("Invalid data format");
            return false;
          }
          
          const { data } = parsed;
          set({
            user: data.user || null,
            userPersonalityType: data.userPersonalityType || null,
            userPersonalityAssessment: data.userPersonalityAssessment || null,
            userPersonalitySessionId: data.userPersonalitySessionId || null,
            assessmentSessions: data.assessmentSessions || [],
            coachSessions: data.coachSessions || [],
            sessionDetails: data.sessionDetails || {},
            journalEntries: data.journalEntries || [],
          });
          return true;
        } catch (error) {
          console.error("Failed to import data:", error);
          return false;
        }
      },

      clearUserData: (userId) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.userId !== userId),
          // Keep sessions for now as they might not have userId
          // Can be extended to clear user-specific sessions if needed
        }));
      },

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
