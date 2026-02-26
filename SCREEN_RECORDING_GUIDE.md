# 🎬 Screen Recording & Screenshot Guide

## Automated Recording with Playwright

I've created an automated script that will record your entire demo and take 34+ screenshots!

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Playwright
```bash
npm install -D playwright
npx playwright install chromium
```

### Step 2: Start Your Application
```bash
# Terminal 1: Start the dev server
npm run dev
```

### Step 3: Run the Automated Recorder
```bash
# Terminal 2: Run the recorder
node playwright-demo-recorder.js
```

**That's it!** The script will:
- ✅ Open browser automatically
- ✅ Login as admin
- ✅ Navigate through all dashboards
- ✅ Take 34+ screenshots
- ✅ Record full video
- ✅ Highlight AI components
- ✅ Save everything to folders

---

## 📁 Output Files

After running, you'll have:

```
demo-screenshots/
├── 01-login-page.png
├── 02-login-filled.png
├── 03-admin-dashboard.png
├── 06-emergency-full-page.png
├── 07-emergency-ai-quick-actions.png
├── 08-emergency-quick-actions-hover.png
├── 09-emergency-insight-cards.png
├── 10-emergency-priority-overview.png
├── 11-emergency-patient-cards-1.png
├── 12-emergency-patient-cards-2.png
├── 13-emergency-ai-button-hover.png
├── 14-emergency-ai-panel-open.png
├── 15-lab-full-page.png
├── 16-lab-ai-quick-actions.png
├── 17-lab-insight-cards.png
├── 22-doctor-full-page.png
├── 23-doctor-ai-quick-actions.png
├── 24-doctor-insight-cards.png
└── ... (34+ total screenshots)

demo-videos/
└── video.webm (Full demo video)
```

---

## 🎥 Manual Recording Options

If you prefer manual recording, here are the best tools:

### Option 1: OBS Studio (FREE - Best Quality)
**Download**: https://obsproject.com/

**Setup**:
1. Install OBS Studio
2. Create new scene
3. Add "Display Capture" source
4. Set resolution to 1920×1080
5. Click "Start Recording"
6. Follow demo script
7. Click "Stop Recording"

**Output**: High-quality MP4 video

### Option 2: macOS Built-in (FREE - Easy)
**Steps**:
1. Press `Cmd + Shift + 5`
2. Select "Record Entire Screen" or "Record Selected Portion"
3. Click "Record"
4. Follow demo script
5. Click Stop in menu bar

**Output**: MOV video

### Option 3: Windows Game Bar (FREE - Easy)
**Steps**:
1. Press `Win + G`
2. Click "Capture" button
3. Click "Start Recording"
4. Follow demo script
5. Press `Win + Alt + R` to stop

**Output**: MP4 video

### Option 4: Loom (FREE - Cloud)
**Website**: https://www.loom.com/

**Steps**:
1. Install Loom extension
2. Click Loom icon
3. Select "Screen + Camera" or "Screen Only"
4. Click "Start Recording"
5. Follow demo script
6. Click "Stop"
7. Get shareable link

**Output**: Cloud-hosted video + link

---

## 📸 Manual Screenshots

### macOS
```bash
# Full screen
Cmd + Shift + 3

# Selected area
Cmd + Shift + 4

# Window
Cmd + Shift + 4, then Space, then click window
```

### Windows
```bash
# Full screen
PrtScn (saves to clipboard)
Win + PrtScn (saves to Pictures/Screenshots)

# Selected area
Win + Shift + S

# Active window
Alt + PrtScn
```

### Linux
```bash
# Full screen
PrtScn

# Selected area
Shift + PrtScn

# Active window
Alt + PrtScn
```

---

## 🎯 What to Capture (Priority Order)

### Must Have (Critical):
1. ✅ Emergency Dashboard - Full page with AI Quick Actions
2. ✅ Emergency Dashboard - AI Insight Cards (3 cards)
3. ✅ Emergency Dashboard - Patient cards with AI badges
4. ✅ Emergency Dashboard - AI panel open
5. ✅ Lab Dashboard - Full page with AI components
6. ✅ Lab Dashboard - Test cards with AI badges
7. ✅ Doctor Dashboard - Full page with AI components
8. ✅ Doctor Dashboard - Patient cards with AI badges

### Should Have (Important):
9. ✅ Login page
10. ✅ Admin dashboard overview
11. ✅ All 3 dashboards side-by-side comparison
12. ✅ Mobile responsive view
13. ✅ AI button hover states
14. ✅ Quick actions in action

### Nice to Have (Optional):
15. ✅ Other dashboards (Patients, Appointments, Pharmacy)
16. ✅ Dark mode (if available)
17. ✅ Different user roles
18. ✅ Settings pages

---

## 🎬 Video Recording Checklist

### Before Recording:
- [ ] Close all unnecessary applications
- [ ] Disable notifications (Do Not Disturb mode)
- [ ] Clean desktop (hide icons)
- [ ] Set browser to full screen (F11)
- [ ] Clear browser cache
- [ ] Test audio (if doing voiceover)
- [ ] Practice demo 2-3 times
- [ ] Have demo script ready

### During Recording:
- [ ] Speak clearly and slowly
- [ ] Pause between sections
- [ ] Highlight important features
- [ ] Show AI components prominently
- [ ] Keep mouse movements smooth
- [ ] Stay under 3 minutes
- [ ] Show all 3 main dashboards

### After Recording:
- [ ] Review video quality
- [ ] Check audio levels
- [ ] Trim unnecessary parts
- [ ] Add title slide (optional)
- [ ] Add end card with links
- [ ] Export in 1080p
- [ ] Upload to YouTube/Vimeo

---

## 🎨 Video Editing (Optional)

### Free Tools:
- **DaVinci Resolve** (Professional, FREE)
- **Shotcut** (Simple, FREE)
- **OpenShot** (Easy, FREE)
- **iMovie** (macOS, FREE)
- **Windows Video Editor** (Windows, FREE)

### Quick Edits:
1. Trim beginning/end
2. Add title slide (5 sec)
3. Add text overlays for key points
4. Add background music (low volume)
5. Add end card with links (5 sec)
6. Export as MP4 (1080p, 60fps)

---

## 📊 Screenshot Organization

### Recommended Structure:
```
demo-materials/
├── screenshots/
│   ├── 01-overview/
│   │   ├── login.png
│   │   └── dashboard.png
│   ├── 02-emergency/
│   │   ├── full-page.png
│   │   ├── ai-actions.png
│   │   ├── insight-cards.png
│   │   └── patient-badges.png
│   ├── 03-laboratory/
│   │   ├── full-page.png
│   │   ├── ai-components.png
│   │   └── test-badges.png
│   └── 04-doctor/
│       ├── full-page.png
│       ├── ai-insights.png
│       └── patient-badges.png
├── videos/
│   ├── full-demo.mp4
│   ├── emergency-only.mp4
│   └── ai-features.mp4
└── social-media/
    ├── twitter-preview.png (1200×675)
    ├── linkedin-preview.png (1200×627)
    └── thumbnail.png (1280×720)
```

---

## 🎯 Playwright Script Features

The automated script includes:

### ✅ Automatic Navigation
- Logs in as admin
- Navigates through all dashboards
- Clicks tabs and buttons
- Scrolls smoothly

### ✅ Smart Screenshots
- Takes 34+ screenshots
- Captures full pages
- Highlights hover states
- Shows AI components

### ✅ Video Recording
- Records entire session
- 1920×1080 resolution
- Smooth 60fps
- Professional quality

### ✅ AI Component Focus
- Hovers over AI buttons
- Opens AI panels
- Shows quick actions
- Highlights badges

---

## 🚨 Troubleshooting

### Playwright Issues:

**Error: "Cannot find module 'playwright'"**
```bash
npm install -D playwright
```

**Error: "Browser not found"**
```bash
npx playwright install chromium
```

**Error: "Connection refused"**
```bash
# Make sure dev server is running
npm run dev
```

**Script runs too fast**
```javascript
// Edit playwright-demo-recorder.js
// Increase slowMo value (line 13)
slowMo: 2000, // Slower
```

**Screenshots are blank**
```javascript
// Add more wait time
await page.waitForTimeout(3000);
```

### Recording Issues:

**Video is choppy**
- Close other applications
- Reduce browser window size
- Lower recording quality

**Audio not recording**
- Check microphone permissions
- Test audio before recording
- Use external microphone

**File size too large**
- Reduce resolution to 720p
- Lower frame rate to 30fps
- Compress after recording

---

## 📤 Upload & Share

### YouTube Upload:
1. Go to youtube.com/upload
2. Select video file
3. Title: "Elasticsearch Agent Builder - Hospital Management System"
4. Description: Include GitHub link
5. Tags: elasticsearch, ai, healthcare, hackathon
6. Thumbnail: Use screenshot #6 or #15
7. Visibility: Public or Unlisted
8. Click "Publish"

### Vimeo Upload:
1. Go to vimeo.com/upload
2. Select video file
3. Add title and description
4. Set privacy to "Anyone"
5. Click "Save"
6. Get shareable link

### Devpost Submission:
1. Go to project submission page
2. Paste YouTube/Vimeo link in "Video URL" field
3. Upload 3-5 best screenshots
4. Add GitHub repository link
5. Submit!

---

## 🎊 Quick Commands

### Run Everything:
```bash
# Terminal 1
npm run dev

# Terminal 2 (wait for server to start)
node playwright-demo-recorder.js
```

### Check Output:
```bash
# View screenshots
open demo-screenshots/

# View video
open demo-videos/
```

### Clean Up:
```bash
# Remove old recordings
rm -rf demo-screenshots demo-videos

# Run again
node playwright-demo-recorder.js
```

---

## 💡 Pro Tips

1. **Record Multiple Takes**: Run script 2-3 times, pick best video
2. **Use Best Screenshots**: You'll have 34+, pick top 10 for submission
3. **Add Annotations**: Use image editor to add arrows/highlights
4. **Create GIFs**: Convert key moments to GIFs for social media
5. **Test First**: Run script once to verify everything works
6. **Backup Files**: Copy recordings to cloud storage
7. **Compress Videos**: Use HandBrake to reduce file size if needed

---

## 📋 Final Checklist

- [ ] Playwright installed
- [ ] Dev server running
- [ ] Script executed successfully
- [ ] 34+ screenshots captured
- [ ] Video recorded
- [ ] Files organized
- [ ] Best screenshots selected
- [ ] Video reviewed
- [ ] Ready for upload

---

## 🎯 Time Estimate

- Setup Playwright: 5 minutes
- Run automated script: 5 minutes
- Review materials: 10 minutes
- Select best screenshots: 10 minutes
- Edit video (optional): 30 minutes
- Upload & share: 10 minutes

**Total: 30-70 minutes**

---

<div align="center">

# 🎬 Ready to Record!

**Run the script and let it do the work!**

```bash
node playwright-demo-recorder.js
```

**Sit back and watch the magic happen! ✨**

</div>

---

**Need help? Check the troubleshooting section or run the script multiple times until you get perfect results!**
