# How to Get a Direct Resume PDF Link from Google Drive

Your current link (`https://drive.google.com/drive/folders/18G8kCL9A00S-5qk-sfTEQbO-M-xLvj-M?usp=drive_link`) points to a folder, not a direct PDF file.

## Steps to Get a Direct PDF Link:

### Option 1: Get Shareable Link (Recommended)
1. Open the Google Drive folder: https://drive.google.com/drive/folders/18G8kCL9A00S-5qk-sfTEQbO-M-xLvj-M
2. Find your resume PDF file
3. Right-click on the PDF file
4. Click "Share" or "Get link"
5. Make sure "Anyone with the link can view" is selected
6. Copy the link
7. The link will look like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

### Option 2: Convert to Direct Download Link
Once you have the shareable link, convert it to a direct download link:
- Replace `/view?usp=sharing` with `/preview` OR
- Use this format: `https://drive.google.com/uc?export=download&id=FILE_ID`
- To get FILE_ID: It's the long string between `/d/` and `/view` in your shareable link

### Option 3: Upload to GitHub (Alternative)
1. Create a new file in your GitHub repo (or create a new repo)
2. Upload your resume PDF
3. Get the raw file URL: `https://raw.githubusercontent.com/Harsh4601/REPO_NAME/main/resume.pdf`
   OR use GitHub Pages: `https://harsh4601.github.io/resume.pdf`

### Option 4: Use a Free Hosting Service
- **Dropbox**: Upload PDF, right-click > Copy Dropbox link, change `?dl=0` to `?dl=1`
- **GitHub Gist**: Upload as a file, get raw URL
- **Netlify Drop**: Drag and drop PDF, get URL

## Once You Have the Link:
Update `submit-application.py` line 29 with your resume URL, then you're ready to submit!

