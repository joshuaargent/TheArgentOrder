// Argent Order brand colors (hex)
export const EMBED_COLORS = {
  PRIMARY: 0xa1a1aa,      // Argent silver
  SUCCESS: 0x22c55e,      // Green
  WARNING: 0xeab308,      // Yellow
  DANGER: 0xef4444,       // Red
  INFO: 0x3b82f6,         // Blue
} as const;

// Server configuration
export const GUILD_ID = process.env.DISCORD_GUILD_ID || "";

// Role names
export const ROLES = {
  NEW_MEMBER: "New Member",
  MEMBER: "Member",
  SERGEANT: "Sergeant",
  CAPTAIN: "Captain",
  COMMANDER: "Commander",
} as const;

// Channel names
export const CHANNELS = {
  WELCOME: "welcome",
  INTRODUCTIONS: "introductions",
  GENERAL: "general",
  FORMATION: "formation",
} as const;
