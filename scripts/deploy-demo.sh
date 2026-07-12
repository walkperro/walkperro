#!/bin/bash
# Deploy a repo's demo-mode branch as its own Vercel project (demo-<slug>).
# Usage: scripts/deploy-demo.sh <repo-dir-name> <slug> <supabase-demo-schema> [branch]
#   e.g. scripts/deploy-demo.sh fozzies fozzies demo_fozzies demo-mode
#
# Mechanics: temporarily re-links the repo dir to the demo Vercel project,
# pushes env (values read from walkperro/.env.local + generated, NEVER echoed),
# deploys the demo branch, then restores the original link + branch.
set -euo pipefail

REPO="$1"; SLUG="$2"; SCHEMA="$3"; BRANCH="${4:-demo-mode}"
SCOPE="ironclaw1644s-projects"
PROJECTS_ROOT="/Users/ironclaw/projects"
WALKPERRO="$PROJECTS_ROOT/walkperro"
DIR="$PROJECTS_ROOT/$REPO"
PROJECT="demo-$SLUG"

cd "$DIR"
ORIG_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 0. Stash the current vercel link
if [ -f .vercel/project.json ]; then
  cp .vercel/project.json /tmp/vercel-link-backup-$SLUG.json
fi

restore() {
  cd "$DIR"
  if [ -f "/tmp/vercel-link-backup-$SLUG.json" ]; then
    mkdir -p .vercel
    mv "/tmp/vercel-link-backup-$SLUG.json" .vercel/project.json
  fi
  git checkout -q "$ORIG_BRANCH" 2>/dev/null || true
}
trap restore EXIT

# 1. Checkout the demo branch
git checkout -q "$BRANCH"

# 2. Link (creates the project if missing)
rm -rf .vercel
vercel link --yes --project "$PROJECT" --scope "$SCOPE" >/dev/null

# 3. Env — pull shared values from walkperro/.env.local without echoing
umask 077
getval() { grep -E "^$1=" "$WALKPERRO/.env.local" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "\n"; }

push_env() { # name value
  vercel env rm "$1" production --yes --scope "$SCOPE" >/dev/null 2>&1 || true
  printf '%s' "$2" | vercel env add "$1" production --scope "$SCOPE" >/dev/null
}

push_env DEMO_MODE "1"
push_env SUPABASE_SCHEMA "$SCHEMA"
push_env NEXT_PUBLIC_SUPABASE_URL "$(getval NEXT_PUBLIC_SUPABASE_URL)"
push_env SUPABASE_URL "$(getval NEXT_PUBLIC_SUPABASE_URL)"
push_env SUPABASE_SECRET_KEY "$(getval SUPABASE_SECRET_KEY)"
CRON=$(openssl rand -hex 16)
push_env CRON_SECRET "$CRON"
# publishable key for repos using @supabase/ssr browser clients
PK="$(getval NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
if [ -n "$PK" ]; then
  push_env NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY "$PK"
  push_env NEXT_PUBLIC_SUPABASE_ANON_KEY "$PK"
fi

# 4. Deploy
echo "deploying $PROJECT from $REPO@$BRANCH ..."
URL=$(vercel --prod --yes --scope "$SCOPE" 2>/dev/null | tail -1)
echo "deployed: $URL"
echo "$PROJECT|$URL|CRON_SECRET_SET" >> /tmp/demo-deploys.log
echo "(cron secret stored in vercel env only)"
