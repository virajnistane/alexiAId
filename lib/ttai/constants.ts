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
  PERSONALITY_TEST: "695bca626e2f8f9c9c54c829",
  /** Personality Coach scenario - TODO: Replace with actual ID */
  PERSONALITY_COACH: "695e33045d060235e03163d3",
} as const;

/**
 * Pre-built embed URLs for scenarios
 */
export const SCENARIO_URLS = {
  PERSONALITY_TEST: `${TOUGHTONGUE_EMBED_BASE}/${SCENARIOS.PERSONALITY_TEST}`,
  PERSONALITY_COACH: `${TOUGHTONGUE_EMBED_BASE}/${SCENARIOS.PERSONALITY_COACH}`,
} as const;
