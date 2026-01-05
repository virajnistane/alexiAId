/**
 * ToughTongue AI Constants
 */

// =============================================================================
// API & Embed URLs
// =============================================================================

export const TOUGHTONGUE_ORIGIN = "https://app.toughtongueai.com";
export const TOUGHTONGUE_EMBED_BASE = `${TOUGHTONGUE_ORIGIN}/embed`;

// =============================================================================
// Scenario IDs
// =============================================================================

/**
 * ToughTongue AI Scenario IDs
 * Configure these for your application
 */
export const SCENARIOS = {
  /** MBTI Personality Test scenario */
  PERSONALITY_TEST: "69577496bd7c000fa3f4fc2a",
  /** Personality Coach scenario - TODO: Replace with actual ID */
  PERSONALITY_COACH: "6958f1a646e4227d62efbd61",
} as const;

/**
 * Pre-built embed URLs for scenarios
 */
export const SCENARIO_URLS = {
  PERSONALITY_TEST: `${TOUGHTONGUE_EMBED_BASE}/${SCENARIOS.PERSONALITY_TEST}`,
  PERSONALITY_COACH: `${TOUGHTONGUE_EMBED_BASE}/${SCENARIOS.PERSONALITY_COACH}`,
} as const;
