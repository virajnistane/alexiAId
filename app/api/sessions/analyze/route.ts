/**
 * POST /api/sessions/analyze - Session Analysis Endpoint
 *
 * Triggers AI analysis of a completed training session.
 * Returns summary, evaluation scores, strengths, and areas for improvement.
 *
 * Request Body:
 *   - session_id (required): The ID of the session to analyze
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeSession, ToughTongueError, type AnalyzeSessionRequest } from "../../ttai/client";

/**
 * Analyzes a session and returns AI-generated feedback.
 * @returns JSON with summary, evaluation, transcript, and metadata
 */
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeSessionRequest = await request.json();

    if (!body.session_id) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const analysis = await analyzeSession(body);
    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
