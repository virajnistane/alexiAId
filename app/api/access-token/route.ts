/**
 * API Route: Create Access Token
 *
 * Creates a short-lived access token for embedding ToughTongue AI scenarios
 * POST /api/access-token
 */

import { NextResponse } from "next/server";
import { createAccessToken } from "../ttai/client";
import type { CreateAccessTokenRequest } from "../ttai/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { scenario_id, duration_hours, email } = body as CreateAccessTokenRequest;

    if (!scenario_id) {
      return NextResponse.json(
        { error: "Missing required field: scenario_id" },
        { status: 400 }
      );
    }

    // Validate duration_hours if provided
    if (duration_hours !== undefined) {
      if (duration_hours < 1 || duration_hours > 24) {
        return NextResponse.json(
          { error: "duration_hours must be between 1 and 24" },
          { status: 400 }
        );
      }
    }

    const result = await createAccessToken({
      scenario_id,
      duration_hours,
      email,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error creating access token:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message || "Failed to create access token",
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create access token" },
      { status: 500 }
    );
  }
}
