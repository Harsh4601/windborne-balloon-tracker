# Quick Deployment Guide

## Option 1: Netlify (Easiest - Recommended)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the entire project folder
3. Your site will be live instantly with a URL like `https://random-name-123.netlify.app`
4. Copy that URL - that's your `submission_url`!

## Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. In the project directory, run: `vercel`
3. Follow the prompts (defaults are fine)
4. Your site will be deployed to a URL like `https://your-project.vercel.app`

## Option 3: GitHub Pages

1. Create a new repository on GitHub
2. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
3. Go to Settings > Pages
4. Select "main" branch and "/ (root)" folder
5. Save - your site will be at `https://yourusername.github.io/your-repo`

## Option 4: Surge.sh

1. Install Surge: `npm install -g surge`
2. In the project directory, run: `surge`
3. Follow the prompts
4. Your site will be at `https://your-project-name.surge.sh`

## Testing Locally

Before deploying, test locally:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

## Important Notes

- Make sure your deployed URL is publicly accessible (no authentication required)
- The app should work immediately after deployment - no build step needed!
- All dependencies are loaded from CDN, so no npm install required
- Test that the map loads and data fetches correctly on your deployed site

