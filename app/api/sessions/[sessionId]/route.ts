/**
 * GET /api/sessions/[sessionId] - Single Session Endpoint
 *
 * Returns detailed information about a specific training session.
 *
 * Path Parameters:
 *   - sessionId: The unique identifier of the session
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession, ToughTongueError } from "../../ttai/client";

/**
 * Fetches a single session by its ID.
 * @returns JSON with session details including status, duration, and timestamps
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const session = await getSession(sessionId);
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
