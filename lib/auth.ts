/**
 * Auth utilities for admin API routes
 */

import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "./config";

/**
 * Verifies admin token from x-admin-token header
 */
export function verifyAdminToken(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  return token === AppConfig.admin.token;
}

/**
 * Returns 401 response for unauthorized requests
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
