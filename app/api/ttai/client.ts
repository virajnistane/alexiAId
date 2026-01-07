/**
 * ToughTongue AI - Server-Side API Client
 *
 * Internal module for API routes to call ToughTongue AI.
 * This code runs only on the server.
 */

import { AppConfig } from "@/lib/config";

// =============================================================================
// Constants
// =============================================================================

const API_BASE_URL = "https://api.toughtongueai.com/api/public";

// =============================================================================
// Types
// =============================================================================

export interface ApiError {
  error: string;
  details?: unknown;
  status: number;
}

// Session types
export interface Session {
  id: string;
  scenario_id: string;
  user_name?: string;
  user_email?: string;
  status: "active" | "completed" | "cancelled";
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
}

export interface SessionListItem {
  id: string;
  scenario_id: string;
  scenario_name?: string;
  user_name?: string;
  user_email?: string;
  duration?: number;
  status: "active" | "completed" | "cancelled" | "terminated";
  created_at: string;
  completed_at?: string;
}

export interface ListSessionsRequest {
  scenario_id?: string;
  limit?: number;
}

export interface ListSessionsResponse {
  sessions: SessionListItem[];
}

export interface SessionAnalysis {
  session_id: string;
  summary: string;
  evaluation: {
    score?: number;
    feedback?: string;
    strengths?: string[];
    improvements?: string[];
  };
  transcript?: Array<{
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }>;
  metadata?: Record<string, unknown>;
}

export interface AnalyzeSessionRequest {
  session_id: string;
}

// Balance types
export interface Balance {
  available_minutes: number;
  last_updated: string;
}

// Access Token types
export interface CreateAccessTokenRequest {
  scenario_id: string;
  duration_hours?: number; // 1-24 hours, default 1
  email?: string; // Optional user email, for org context use *@ORG-ID.toughtongueai.com
}

export interface CreateAccessTokenResponse {
  access_token: string;
  expires_at: string;
  scenario_id: string;
}

// =============================================================================
// Error Class
// =============================================================================

export class ToughTongueError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ToughTongueError";
  }

  toApiError(): ApiError {
    return {
      error: this.message,
      details: this.details,
      status: this.status || 500,
    };
  }
}

// =============================================================================
// API Client
// =============================================================================

interface RequestOptions {
  method: "GET" | "POST";
  body?: unknown;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const apiKey = AppConfig.toughTongue.apiKey;

  if (!apiKey) {
    throw new ToughTongueError("API key not configured", "CONFIG_ERROR");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ToughTongueError(
      data.message || "API request failed",
      "API_ERROR",
      response.status,
      data
    );
  }

  return data as T;
}

// =============================================================================
// API Functions
// =============================================================================

/** Get account balance */
export async function getBalance(): Promise<Balance> {
  return apiRequest<Balance>("/balance", { method: "GET" });
}

/** List sessions with optional filtering */
export async function listSessions(request?: ListSessionsRequest): Promise<ListSessionsResponse> {
  const params = new URLSearchParams();
  if (request?.scenario_id) params.set("scenario_id", request.scenario_id);
  if (request?.limit) params.set("limit", request.limit.toString());

  const query = params.toString();
  return apiRequest<ListSessionsResponse>(query ? `/sessions?${query}` : "/sessions", {
    method: "GET",
  });
}

/** Get session details */
export async function getSession(sessionId: string): Promise<Session> {
  return apiRequest<Session>(`/sessions/${sessionId}`, { method: "GET" });
}

/** Analyze a session */
export async function analyzeSession(request: AnalyzeSessionRequest): Promise<SessionAnalysis> {
  return apiRequest<SessionAnalysis>("/sessions/analyze", {
    method: "POST",
    body: { session_id: request.session_id },
  });
}

/** Create a short-lived access token for embedding scenarios */
export async function createAccessToken(
  request: CreateAccessTokenRequest
): Promise<CreateAccessTokenResponse> {
  return apiRequest<CreateAccessTokenResponse>("/scenario-access-token", {
    method: "POST",
    body: {
      scenario_id: request.scenario_id,
      duration_hours: request.duration_hours || 1,
      ...(request.email && { email: request.email }),
    },
  });
}

/** Check if API is configured */
export function isConfigured(): boolean {
  return !!AppConfig.toughTongue.apiKey;
}
