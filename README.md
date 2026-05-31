# Bragibytes

A fast, beautiful personal blog about building software by directing AI models and agents.

**Live demo**: [bragibytes.com](https://bragibytes.com)

## Tech Stack

- **Astro 6** — Content-first framework with islands architecture
- **MDX + Content Collections** — Type-safe Markdown/MDX with excellent DX
- **Tailwind CSS v4** — Utility-first styling with beautiful prose defaults
- **Shiki** — Best-in-class syntax highlighting (dual light/dark themes)
- **Pagefind** — Instant, zero-backend static search (Cmd/Ctrl+K)
- **TypeScript** (strict)

The site itself was largely built by directing an AI (see the first post).

Everything is deliberately small and understandable. The entire interesting part of the codebase is a few thousand lines.

## Getting Started

**See the live site right now (recommended first step):**

```bash
npm start
# or: npm run preview
```

Open http://localhost:4321

**To edit the blog / develop:**

```bash
npm run dev
```

## Writing a New Post (Recommended Workflow)

Because this blog is built around AI-assisted development, the fastest way to publish is:

### Option 1: Talk to me (Grok / AI)

Just open this project in your AI coding environment (Cursor, Claude, Aider, or even this Grok session) and say:

> "Create a new post about [topic]. Title: [optional title]"

I will generate the file with proper frontmatter and good structure. Then you review, edit, and push.

### Option 2: Use the CLI helper

```bash
npm run new-post "Your Post Title"
# or with draft mode:
npm run new-post "Draft Idea" -- --draft
```

This creates a properly scaffolded file in `src/content/blog/`.

### Option 3: Manual

Create `src/content/blog/your-slug-here.mdx` and add frontmatter:

```mdx
---
title: "Your Excellent Title"
description: "A single-sentence summary that appears in cards and meta tags."
pubDate: 2026-06-01
tags: ["ai", "workflow"]
draft: false
---
```

Draft posts (`draft: true`) are hidden in production builds.

### Frontmatter fields

| Field         | Required | Notes |
|---------------|----------|-------|
| `title`       | Yes      | Post title |
| `description` | Yes      | ≤ 200 chars recommended for SEO |
| `pubDate`     | Yes      | `YYYY-MM-DD` or full date |
| `updatedDate` | No       | Shows "Updated ..." on the post |
| `tags`        | No       | Array of strings (e.g. `["ai", "workflow"]`) |
| `draft`       | No       | `true` hides from production builds |

## Key Features

- **Exceptional reading experience** — 72ch measure, beautiful typography, excellent dark mode
- **Copy code buttons** on every code block
- **Table of Contents** (auto-generated for posts with 3+ headings)
- **Reading time** calculated at build
- **Powerful search** — Press `⌘K` or click the search icon. Powered by Pagefind (static index)
- **Tag browsing** — `/tags` and `/tags/[tag]`
- **Full RSS feed** at `/rss.xml`
- **Sitemap** auto-generated
- **View Transitions** for smooth page navigation
- **Mobile-first** with excellent responsive behavior
- **Print styles** (great for saving articles as PDF)

## Customization

All identity and branding lives in one place:

**`src/config.ts`**

Change the site name, description, social links, URL, accent colors (via CSS variables in `global.css`), etc.

## Pre-Deployment Checklist (Do These First)

Before deploying, complete these items:

### 1. Newsletter (Buttondown) – Required for the signup form to work

1. Create a free account at [buttondown.email](https://buttondown.email)
2. Copy your Buttondown **username** (visible in your dashboard URL)
3. Open `src/config.ts`
4. Replace the placeholder:
   ```ts
   newsletter: {
     buttondown: "your-username",   // ← change this
   },
   ```
5. Commit + push the change.

### 2. Vercel Account

- Create a free account at [vercel.com](https://vercel.com) if you don’t have one yet.
- Connect your GitHub account.

## Deployment

Because this project uses **git worktrees** heavily (common with long Grok sessions), there are two good ways to deploy:

### 1. Fastest from any worktree (recommended for day-to-day)

```bash
npm run deploy
```

This uses the Vercel CLI to deploy the current directory directly to production. It does **not** require committing or pushing. Great when you're in an isolated worktree.

First time only:
```bash
npm i -g vercel
vercel login
```

### 2. Traditional git flow (permanent history)

```bash
npm run deploy:git
```

This commits your changes, pushes to GitHub `main`, and lets Vercel deploy via the GitHub integration (the normal way).

After the first successful deploy:
- (Optional) Update `url` in `src/config.ts` to your Vercel URL if you want.
- Later, when you’re ready, add your custom domain `bragibytes.com` in Vercel settings.

## Scripts

| Command            | Description                                           | Best when                              |
|--------------------|-------------------------------------------------------|----------------------------------------|
| `npm run deploy`   | Direct deploy to production (no git push required)    | You're in a worktree / want speed      |
| `npm run deploy:git` | Commit your changes + push to GitHub                | You want clean git history             |
| `npm run dev`      | Local development server with hot reload              | Daily development                      |
| `npm run build`    | Production build + Pagefind search indexing           | Testing the final output               |
| `npm run preview`  | Serve the production build locally                    | Final checks before deploying          |

## Project Structure (Key Parts)

```
src/
├── components/          # Reusable UI (PostCard, Header, Footer, SearchModal, TOC...)
├── content/
│   ├── blog/            # Your posts go here (.md or .mdx)
│   └── config.ts        # Content Collections schema (Zod)
├── layouts/             # BaseLayout + BlogPostLayout (the reading experience)
├── pages/               # Routing (index, blog/, tags/, rss.xml.ts, etc.)
├── styles/global.css    # Tailwind + custom design tokens + prose styles
└── config.ts            # Site-wide branding & metadata
```

## Philosophy

This blog was built with three priorities, in order:

1. **The reader** — Fast, calm, beautiful long-form reading on every device
2. **The writer** — Frictionless to publish. One file, one command, done.
3. **The maintainer** — Tiny, boring, obvious code. No magic you’ll be afraid to touch in six months.

## Contributing / Feedback

This is a personal site, but if you spot a bug or have a strong opinion about the reading experience, feel free to open an issue or PR.

## License

MIT — do whatever you want with the code.

---

Built with care in 2026. Go write something great.
