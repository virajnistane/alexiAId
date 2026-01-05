/**
 * GET /api/balance - Account Balance Endpoint
 *
 * Returns the available minutes balance for the ToughTongue AI account.
 * Requires admin authentication via Bearer token.
 */

import { NextRequest, NextResponse } from "next/server";
import { getBalance, ToughTongueError } from "../ttai/client";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";

/**
 * Fetches the current account balance from ToughTongue AI.
 * @returns JSON with `available_minutes` and `last_updated` fields
 */
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();

  try {
    const balance = await getBalance();
    return NextResponse.json(balance);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
