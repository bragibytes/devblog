/**
 * Central site configuration.
 * Change these values and the whole blog updates.
 */
export const site = {
  name: "Bragibytes",
  title: "Bragibytes",
  description:
    "Notes on building real software by directing AI models, agents, and tools. The shift from writing every line to orchestrating intelligence.",
  url: "https://bragibytes.com",
  author: {
    name: "Sam Bragi",
    email: "rustycoder42@gmail.com",
    github: "bragibytes",
  },
  social: {
    github: "https://github.com/bragibytes",
    twitter: "https://x.com/bragibytes",
    // linkedin, mastodon, etc. can be added here
  },
  repo: "https://github.com/bragibytes/devblog", // Update to your actual repo
  defaultOgImage: "/og/default.png", // We'll create a simple one or use dynamic later

  newsletter: {
    // Buttondown setup (recommended for static sites)
    // 1. Create a free account at https://buttondown.email
    // 2. Replace the value below with your actual Buttondown username
    buttondown: "your-username",
  },
} as const;

export type SiteConfig = typeof site;
