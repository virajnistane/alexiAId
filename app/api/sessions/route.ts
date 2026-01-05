/**
 * GET /api/sessions - List Sessions Endpoint
 *
 * Returns a paginated list of training sessions from ToughTongue AI.
 * Requires admin authentication via Bearer token.
 *
 * Query Parameters:
 *   - scenario_id (optional): Filter sessions by scenario
 *   - limit (optional): Max number of sessions to return
 */

import { NextRequest, NextResponse } from "next/server";
import { listSessions, ToughTongueError } from "../ttai/client";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";

/**
 * Lists sessions with optional filtering by scenario and pagination.
 * @returns JSON with `sessions` array containing session metadata
 */
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const scenario_id = searchParams.get("scenario_id") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const response = await listSessions({ scenario_id, limit });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
