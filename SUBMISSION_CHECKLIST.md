# Submission Checklist

## ✅ Completed
- [x] Application built and tested locally
- [x] Name: Harsh Vivek Londhekar
- [x] Email: harsh.londhekar@stonybrook.edu
- [x] Portfolio URL: https://harsh4601.github.io/
- [x] Project URL: https://github.com/Harsh4601/Banking-System-Using-Modified-Paxos-and-Two-Phase-Commit-Protocols

## ⏳ In Progress
- [ ] **Deploy to GitHub Pages** (follow steps below)
- [ ] **Fix Resume Link** (get direct PDF link from Google Drive)

## 📋 Steps to Complete

### 1. Deploy to GitHub Pages

```bash
# 1. Create the repository on GitHub first:
#    Go to: https://github.com/new
#    Repository name: windborne-balloon-tracker
#    Make it PUBLIC
#    DO NOT initialize with README
 
# 2. Push your code:
cd /Users/harshlondhekar/Desktop/jwd
git push -u origin master

# 3. Enable GitHub Pages:
#    - Go to: https://github.com/Harsh4601/windborne-balloon-tracker/settings/pages
#    - Source: Deploy from a branch
#    - Branch: master, folder: / (root)
#    - Click Save

# 4. Wait 1-2 minutes, then visit:
#    https://harsh4601.github.io/windborne-balloon-tracker/
```

### 2. Fix Resume Link

Your Google Drive link is a folder link. You need a direct PDF link:

**Quick Fix:**
1. Open: https://drive.google.com/drive/folders/18G8kCL9A00S-5qk-sfTEQbO-M-xLvj-M
2. Find your resume PDF
3. Right-click > Share > Get link
4. Make sure "Anyone with the link can view" is enabled
5. Copy the link (it will look like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)
6. Convert to direct download: Replace `/view?usp=sharing` with `/uc?export=download&id=FILE_ID`
   - Or use: `https://drive.google.com/uc?export=download&id=FILE_ID`

**Alternative:** Upload resume to GitHub and use raw URL

### 3. Update Submission Script

Once you have:
- ✅ GitHub Pages URL working
- ✅ Direct resume PDF link

Edit `submit-application.py` line 29:
```python
"resume_url": "YOUR_DIRECT_PDF_LINK_HERE"
```

### 4. Submit Application

```bash
python3 submit-application.py
```

**Make sure you get a 200 status code!** Any other status means it wasn't accepted.

## 🎯 Final URLs Needed

- **Submission URL**: `https://harsh4601.github.io/windborne-balloon-tracker/` (after deployment)
- **Portfolio URL**: `https://harsh4601.github.io/` ✅
- **Resume URL**: `[Direct PDF link from Google Drive]` ⏳

## 📝 Notes Field (Already Set)

The notes field includes:
- Your specialization
- Collaboration skills
- Explanation of why you chose OpenWeatherMap API

You can customize it in `submit-application.py` line 26 if desired.

