#!/usr/bin/env tsx

/**
 * Usage:
 *   npm run new-post "My Post Title"
 *   npm run new-post "Another Great Idea" --draft
 *
 * This creates a new .mdx file in src/content/blog/ with sensible defaults.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const title = args[0];
const isDraft = args.includes('--draft') || args.includes('-d');

if (!title) {
  console.error('Please provide a post title.');
  console.error('Example: npm run new-post "Why AI Changes Everything"');
  process.exit(1);
}

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim();

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const frontmatter = `---
title: "${title}"
description: ""
pubDate: ${today}
tags: []
draft: ${isDraft}
---
`;

const content = `${frontmatter}
Write your post here...

`;

const postsDir = path.resolve(__dirname, '../src/content/blog');
const filePath = path.join(postsDir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`A post with slug "${slug}" already exists at ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');

console.log(`✅ Created new post: ${filePath}`);
console.log(`   Slug: ${slug}`);
console.log(`   Draft: ${isDraft}`);
console.log('');
console.log('Next steps:');
console.log('  1. Open the file and fill in the description + tags');
console.log('  2. Write your content');
console.log('  3. Set draft: false when ready');
console.log('  4. Commit and push to deploy');
