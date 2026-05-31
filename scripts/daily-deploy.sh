#!/bin/bash
set -e

echo "📅 Daily Deploy for Bragibytes"
echo ""

cd "$(dirname "$0")/.."

# Find the last deploy tag
LAST_TAG=$(git describe --tags --match "deploy-*" --abbrev=0 2>/dev/null || echo "")

if [ -z "$LAST_TAG" ]; then
  echo "No previous deploy tag found. Showing all commits since the beginning."
  RANGE="HEAD"
else
  echo "Changes since last deploy ($LAST_TAG):"
  echo ""
  git log --oneline "$LAST_TAG"..HEAD
  RANGE="$LAST_TAG..HEAD"
fi

echo ""
echo "Current uncommitted / uncommitted changes:"
git status --short

if [ -z "$(git status --porcelain)" ] && [ "$LAST_TAG" != "" ]; then
  # Check if there are any commits since last tag
  if [ -z "$(git log --oneline $RANGE)" ]; then
    echo ""
    echo "✅ No new changes since last deploy. Nothing to push."
    exit 0
  fi
fi

echo ""
echo "This will commit all current work as one daily batch and push."
read -p "Enter a summary for today's changes (or press Enter for default): " summary

if [ -z "$summary" ]; then
  summary="Daily batch update"
fi

DATE=$(date +%Y-%m-%d)
TAG="deploy-$DATE"

echo ""
echo "📦 Committing daily batch..."
git add -A
git commit -m "$summary

Daily batch deploy: $DATE" || echo "(No new commit needed — working tree was clean)"

echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "🏷️  Creating deploy tag: $TAG"
git tag -a "$TAG" -m "Daily deploy $DATE"

echo ""
echo "⬆️  Pushing tag..."
git push origin "$TAG"

echo ""
echo "✅ Daily deploy complete."
echo "Vercel should start deploying the batch shortly."
echo "Check: https://vercel.com/bragibytes/devblog"