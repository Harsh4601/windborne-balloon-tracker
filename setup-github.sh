#!/bin/bash

# Script to set up GitHub repository and deploy to GitHub Pages

REPO_NAME="windborne-balloon-tracker"
GITHUB_USERNAME="Harsh4601"

echo "🚀 Setting up GitHub repository for WindBorne Balloon Tracker..."
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote repository
echo "📦 Adding GitHub remote..."
git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to https://github.com/new and create a repository named: ${REPO_NAME}"
echo "   2. Make sure it's PUBLIC (required for free GitHub Pages)"
echo "   3. DO NOT initialize with README, .gitignore, or license"
echo "   4. Then run: git push -u origin master"
echo ""
echo "🌐 After pushing, enable GitHub Pages:"
echo "   1. Go to your repo: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "   2. Settings > Pages"
echo "   3. Source: Deploy from a branch"
echo "   4. Branch: master, folder: / (root)"
echo "   5. Save"
echo ""
echo "   Your app will be live at: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo ""

