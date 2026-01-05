/**
 * Admin Page Utilities
 *
 * Helper functions for formatting and display logic in the admin dashboard.
 */

import { CheckCircle, Play, XCircle } from "lucide-react";

/**
 * Formats duration in seconds to a human-readable string (e.g., "2m 30s").
 */
export function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

/**
 * Formats an ISO date string to a short locale format (e.g., "Jan 15, 2:30 PM").
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Checks if a date string is within the last 30 days.
 */
export function isWithinLast30Days(dateString: string): boolean {
  const date = new Date(dateString);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return date >= thirtyDaysAgo;
}

/**
 * Returns the appropriate text color class for a session status.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-green-400";
    case "active":
      return "text-blue-400";
    case "cancelled":
    case "terminated":
      return "text-red-400";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Returns the appropriate icon component for a session status.
 */
export function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "active":
      return Play;
    case "cancelled":
    case "terminated":
      return XCircle;
    default:
      return null;
  }
}
