# 🎬 Automated Demo Recording - Quick Start

## 3-Step Process (10 Minutes Total)

### Step 1: Install Playwright (2 minutes)
```bash
npm run demo:install
```

This will:
- Install Playwright
- Download Chromium browser
- Set up everything automatically

### Step 2: Start Your App (1 minute)
```bash
# Open Terminal 1
npm run dev
```

Wait until you see:
```
➜  Local:   http://localhost:3000/
```

### Step 3: Record Demo (5 minutes)
```bash
# Open Terminal 2
npm run demo:record
```

**Sit back and watch!** The script will:
- ✅ Open browser automatically
- ✅ Login as admin
- ✅ Navigate through all dashboards
- ✅ Take 34+ screenshots
- ✅ Record full video
- ✅ Highlight all AI components
- ✅ Save everything

---

## 📁 Where Are My Files?

After recording completes, check these folders:

```
demo-screenshots/     ← 34+ PNG screenshots
demo-videos/          ← Full demo video (WebM format)
```

### View Your Files:
```bash
# macOS
open demo-screenshots/
open demo-videos/

# Windows
explorer demo-screenshots
explorer demo-videos

# Linux
xdg-open demo-screenshots/
xdg-open demo-videos/
```

---

## 🎯 What Gets Recorded?

### Screenshots (34+):
1. **Login Page** (2 screenshots)
2. **Admin Dashboard** (3 screenshots)
3. **Emergency Management** (9 screenshots)
   - AI Quick Actions Bar
   - AI Insight Cards
   - Patient cards with AI badges
   - AI panel open
4. **Laboratory Dashboard** (7 screenshots)
   - AI components
   - Test cards with badges
5. **Doctor Dashboard** (6 screenshots)
   - AI insights
   - Patient cards with badges
6. **Other Dashboards** (7 screenshots)
   - Patients, Appointments, Pharmacy, etc.

### Video:
- Full demo walkthrough
- All dashboards
- All AI components
- Professional quality (1920×1080)

---

## 🎨 Best Screenshots for Submission

After recording, use these screenshots for your hackathon submission:

### Must Include (Top 5):
1. `06-emergency-full-page.png` - Shows entire Emergency dashboard with AI
2. `09-emergency-insight-cards.png` - Shows 3 AI insight cards
3. `11-emergency-patient-cards-1.png` - Shows AI badges on patients
4. `15-lab-full-page.png` - Shows Lab dashboard with AI
5. `22-doctor-full-page.png` - Shows Doctor dashboard with AI

### Nice to Include (Next 5):
6. `07-emergency-ai-quick-actions.png` - AI Quick Actions bar
7. `14-emergency-ai-panel-open.png` - AI assistant panel
8. `17-lab-insight-cards.png` - Lab AI insights
9. `24-doctor-insight-cards.png` - Doctor AI insights
10. `03-admin-dashboard.png` - Main dashboard overview

---

## 🎥 Video Conversion

The video is saved as `.webm` format. To convert to MP4:

### Using FFmpeg (Recommended):
```bash
# Install FFmpeg first
# macOS: brew install ffmpeg
# Windows: Download from ffmpeg.org
# Linux: sudo apt install ffmpeg

# Convert to MP4
ffmpeg -i demo-videos/video.webm -c:v libx264 -crs 23 -preset medium -c:a aac -b:a 128k demo-video-final.mp4
```

### Using Online Converter:
1. Go to https://cloudconvert.com/webm-to-mp4
2. Upload your video.webm file
3. Click "Convert"
4. Download MP4 file

---

## 🚨 Troubleshooting

### "Cannot find module 'playwright'"
```bash
npm run demo:install
```

### "Connection refused" or "Cannot connect"
Make sure dev server is running:
```bash
# Terminal 1
npm run dev
```
Wait for "Local: http://localhost:3000/" message, then run recorder.

### Script runs too fast
Edit `playwright-demo-recorder.js` line 13:
```javascript
slowMo: 2000, // Change from 1000 to 2000 (slower)
```

### Screenshots are blank
Edit `playwright-demo-recorder.js`, add more wait time:
```javascript
await page.waitForTimeout(5000); // Increase from 2000 to 5000
```

### Video quality is poor
Edit `playwright-demo-recorder.js` line 10:
```javascript
viewport: {
  width: 1920,
  height: 1080
}
```

### Want to record again
```bash
# Delete old recordings
rm -rf demo-screenshots demo-videos

# Record again
npm run demo:record
```

---

## 🎯 Quick Commands Reference

```bash
# Install Playwright
npm run demo:install

# Start app
npm run dev

# Record demo (in separate terminal)
npm run demo:record

# View screenshots
open demo-screenshots/

# View video
open demo-videos/

# Clean up and re-record
rm -rf demo-screenshots demo-videos && npm run demo:record
```

---

## 📊 What Happens During Recording?

You'll see the browser open and automatically:

1. **0:00-0:10** - Navigate to login page, fill credentials
2. **0:10-0:20** - Login and view admin dashboard
3. **0:20-1:00** - Emergency Management (main demo)
   - Scroll through page
   - Hover over AI components
   - Open AI panel
4. **1:00-1:30** - Laboratory Dashboard
   - Show AI components
   - View test cards
5. **1:30-2:00** - Doctor Dashboard
   - Show AI insights
   - View patient cards
6. **2:00-2:30** - Quick tour of other dashboards
7. **2:30-3:00** - Final showcase

**Total Time: ~3 minutes**

---

## 💡 Pro Tips

1. **Run Multiple Times**: Execute script 2-3 times, pick best results
2. **Check Output**: Review screenshots before submitting
3. **Select Best**: You'll have 34+ screenshots, pick top 10
4. **Backup Files**: Copy to cloud storage immediately
5. **Test First**: Run once to verify everything works
6. **Close Apps**: Close other applications for better performance
7. **Disable Notifications**: Turn on "Do Not Disturb" mode

---

## 📤 Next Steps After Recording

### 1. Review Materials
```bash
open demo-screenshots/
open demo-videos/
```

### 2. Select Best Screenshots
Pick 5-10 best screenshots for submission

### 3. Convert Video (if needed)
Convert WebM to MP4 using FFmpeg or online tool

### 4. Upload Video
- YouTube: youtube.com/upload
- Vimeo: vimeo.com/upload

### 5. Submit to Devpost
- Add video link
- Upload screenshots
- Add GitHub link
- Submit!

---

## 🎊 Success Checklist

- [ ] Playwright installed (`npm run demo:install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Demo recorded (`npm run demo:record`)
- [ ] 34+ screenshots captured
- [ ] Video file created
- [ ] Files reviewed
- [ ] Best screenshots selected
- [ ] Video converted to MP4 (if needed)
- [ ] Ready for upload

---

<div align="center">

# 🚀 Ready to Record!

**Just run these commands:**

```bash
# Terminal 1
npm run dev

# Terminal 2 (after server starts)
npm run demo:record
```

**That's it! The script does everything else! ✨**

</div>

---

## 📞 Need Help?

Check the full guide: `SCREEN_RECORDING_GUIDE.md`

Or just run the script again - it's automated! 🎬
