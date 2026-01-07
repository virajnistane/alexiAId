/**
 * Application Constants
 *
 * MBTI personality types and application routes.
 * ToughTongue AI specific constants are in lib/toughtongue/
 */

// =============================================================================
// Routes
// =============================================================================

export const ROUTES = {
  HOME: "/",
  TEST: "/test",
  RESULTS: "/results",
  JOURNAL: "/journal",
  COACH: "/coach",
  SETTINGS: "/settings",
  ADMIN: "/admin",
  SIGNIN: "/auth/signin",
} as const;

// =============================================================================
// MBTI Types
// =============================================================================

export const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export type MBTIType = (typeof MBTI_TYPES)[number];

export const MBTI_TYPE_DETAILS: Record<
  MBTIType,
  {
    name: string;
    nickname: string;
    description: string;
    character: string;
    traits: string[];
    strengths: string[];
  }
> = {
  INTJ: {
    name: "The Architect",
    nickname: "Strategic Mastermind",
    description:
      "Imaginative and strategic thinkers with a plan for everything. INTJs are analytical problem-solvers who excel at seeing the big picture and developing long-term strategies.",
    character: "♟️",
    traits: ["Strategic", "Independent", "Analytical", "Determined"],
    strengths: [
      "Strategic thinking",
      "Long-term planning",
      "Independent work",
      "Complex problem-solving",
    ],
  },
  INTP: {
    name: "The Logician",
    nickname: "Innovative Thinker",
    description:
      "Innovative inventors with an unquenchable thirst for knowledge. INTPs love exploring theoretical concepts and finding logical explanations for everything.",
    character: "🔬",
    traits: ["Logical", "Curious", "Objective", "Abstract"],
    strengths: ["Theoretical analysis", "Pattern recognition", "Innovation", "Logical reasoning"],
  },
  ENTJ: {
    name: "The Commander",
    nickname: "Bold Leader",
    description:
      "Bold, imaginative, and strong-willed leaders who always find a way. ENTJs are natural-born leaders who excel at organizing people and resources.",
    character: "👑",
    traits: ["Decisive", "Efficient", "Strategic", "Assertive"],
    strengths: ["Leadership", "Strategic planning", "Organization", "Decision-making"],
  },
  ENTP: {
    name: "The Debater",
    nickname: "Clever Innovator",
    description:
      "Smart and curious thinkers who cannot resist an intellectual challenge. ENTPs love brainstorming new ideas and engaging in stimulating debates.",
    character: "💡",
    traits: ["Quick-witted", "Innovative", "Outspoken", "Clever"],
    strengths: ["Brainstorming", "Debate", "Innovation", "Adaptability"],
  },
  INFJ: {
    name: "The Advocate",
    nickname: "Inspiring Idealist",
    description:
      "Quiet and mystical, yet very inspiring and tireless idealists. INFJs are deeply principled and passionate about helping others reach their potential.",
    character: "🌟",
    traits: ["Insightful", "Idealistic", "Compassionate", "Organized"],
    strengths: ["Understanding others", "Visionary thinking", "Writing", "Counseling"],
  },
  INFP: {
    name: "The Mediator",
    nickname: "Poetic Idealist",
    description:
      "Poetic, kind, and altruistic people, always eager to help a good cause. INFPs are guided by their values and seek harmony in everything they do.",
    character: "🎨",
    traits: ["Idealistic", "Creative", "Empathetic", "Open-minded"],
    strengths: ["Creative expression", "Empathy", "Diplomacy", "Authenticity"],
  },
  ENFJ: {
    name: "The Protagonist",
    nickname: "Charismatic Leader",
    description:
      "Charismatic and inspiring leaders who captivate their audiences. ENFJs are natural motivators who bring out the best in others.",
    character: "🎭",
    traits: ["Charismatic", "Reliable", "Altruistic", "Persuasive"],
    strengths: ["Inspiring others", "Communication", "Teaching", "Leadership"],
  },
  ENFP: {
    name: "The Campaigner",
    nickname: "Enthusiastic Visionary",
    description:
      "Enthusiastic, creative, and sociable free spirits who can always find a reason to smile. ENFPs are passionate about new ideas and possibilities.",
    character: "🎪",
    traits: ["Enthusiastic", "Creative", "Spontaneous", "Energetic"],
    strengths: ["Communication", "Creativity", "Enthusiasm", "Connecting with others"],
  },
  ISTJ: {
    name: "The Logistician",
    nickname: "Reliable Organizer",
    description:
      "Practical and fact-minded individuals whose reliability cannot be doubted. ISTJs are organized, detail-oriented, and committed to their responsibilities.",
    character: "📋",
    traits: ["Responsible", "Practical", "Organized", "Factual"],
    strengths: ["Organization", "Reliability", "Attention to detail", "Follow-through"],
  },
  ISFJ: {
    name: "The Defender",
    nickname: "Nurturing Protector",
    description:
      "Very dedicated and warm protectors, always ready to defend their loved ones. ISFJs are caring individuals who value tradition and loyalty.",
    character: "🛡️",
    traits: ["Supportive", "Reliable", "Patient", "Observant"],
    strengths: ["Supporting others", "Attention to detail", "Hard work", "Loyalty"],
  },
  ESTJ: {
    name: "The Executive",
    nickname: "Efficient Organizer",
    description:
      "Excellent administrators who are unmatched at managing things and people. ESTJs are practical, organized, and dedicated to getting things done.",
    character: "📊",
    traits: ["Organized", "Practical", "Direct", "Dedicated"],
    strengths: ["Management", "Organization", "Direct communication", "Implementation"],
  },
  ESFJ: {
    name: "The Consul",
    nickname: "Caring Host",
    description:
      "Extraordinarily caring, social, and popular people, always eager to help. ESFJs are warm-hearted individuals who thrive on bringing people together.",
    character: "💝",
    traits: ["Caring", "Social", "Loyal", "Organized"],
    strengths: ["Helping others", "Social skills", "Organization", "Harmony"],
  },
  ISTP: {
    name: "The Virtuoso",
    nickname: "Bold Experimenter",
    description:
      "Bold and practical experimenters, masters of all kinds of tools. ISTPs are action-oriented problem-solvers who excel at hands-on work.",
    character: "🔧",
    traits: ["Practical", "Spontaneous", "Logical", "Hands-on"],
    strengths: ["Problem-solving", "Practical skills", "Crisis management", "Adaptability"],
  },
  ISFP: {
    name: "The Adventurer",
    nickname: "Flexible Artist",
    description:
      "Flexible and charming artists, always ready to explore and experience something new. ISFPs live in the moment and appreciate beauty in all forms.",
    character: "🎨",
    traits: ["Artistic", "Sensitive", "Flexible", "Spontaneous"],
    strengths: ["Artistic expression", "Empathy", "Hands-on work", "Adaptability"],
  },
  ESTP: {
    name: "The Entrepreneur",
    nickname: "Energetic Doer",
    description:
      "Smart, energetic, and very perceptive people who truly enjoy living on the edge. ESTPs are action-oriented and love taking calculated risks.",
    character: "⚡",
    traits: ["Energetic", "Perceptive", "Direct", "Bold"],
    strengths: ["Action-taking", "Persuasion", "Crisis management", "Adaptability"],
  },
  ESFP: {
    name: "The Entertainer",
    nickname: "Spontaneous Performer",
    description:
      "Spontaneous, energetic, and enthusiastic people who love life and make it fun for everyone. ESFPs are natural performers who bring joy to those around them.",
    character: "🎉",
    traits: ["Spontaneous", "Enthusiastic", "Friendly", "Fun-loving"],
    strengths: ["Entertainment", "Connecting with people", "Living in the moment", "Positivity"],
  },
};
