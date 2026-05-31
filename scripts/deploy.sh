#!/bin/bash
set -e

echo "🚀 Bragibytes Deploy Helper"
echo ""

# Show current status
echo "Current changes:"
git status --short
echo ""

if [ -z "$(git status --porcelain)" ]; then
  echo "✅ No changes to deploy."
  exit 0
fi

# Get commit message
if [ -z "$1" ]; then
  echo "Enter commit message (or press Enter for a default):"
  read -r commit_msg
  if [ -z "$commit_msg" ]; then
    commit_msg="Update site"
  fi
else
  commit_msg="$1"
fi

echo ""
echo "📦 Committing with message: \"$commit_msg\""
git add -A
git commit -m "$commit_msg"

echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Pushed successfully."
echo "Vercel should start deploying shortly."
echo "Check status at: https://vercel.com/bragibytes/devblog"