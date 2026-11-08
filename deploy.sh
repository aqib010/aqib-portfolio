#!/usr/bin/env bash
# One-step publish to GitHub. Run inside this folder:  bash deploy.sh [repo-name]
set -e
REPO=${1:-portfolio}
[ -d .git ] || git init -q
git add .
git commit -m "Portfolio update" || true
git branch -M main
if command -v gh >/dev/null 2>&1 && ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "aqib010/$REPO" --public --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/aqib010/$REPO.git"
  git push -u origin main
fi
echo "Now enable Settings > Pages > Source: GitHub Actions. Live at https://aqib010.github.io/$REPO/"
