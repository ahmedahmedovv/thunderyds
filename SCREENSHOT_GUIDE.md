# Screenshot Size Guide for App Store

## Required Dimensions for iPhone 6.5" Display

| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPhone 14 Pro Max | **1284 × 2778px** | 2778 × 1284px |
| iPhone 12/13 Pro Max | **1284 × 2778px** | 2778 × 1284px |
| iPhone XS Max | 1242 × 2688px | 2688 × 1242px |

**Recommended: 1284 × 2778px** (iPhone 14 Pro Max)

---

## Method 1: iOS Simulator (Easiest)

### Step 1: Open Simulator
```bash
# Open Xcode simulator
open -a Simulator
```

### Step 2: Select Correct Device
```
File → Open Simulator → iPhone 14 Pro Max
```

### Step 3: Run Your App
```bash
cd "/Users/mybook/Desktop/app/17 Capacitor"
npx cap open ios

# In Xcode:
# 1. Select target: iPhone 14 Pro Max (simulator)
# 2. Click Run button (▶)
```

### Step 4: Take Screenshots
```
In Simulator:
Device → Screenshot (or Cmd+S)

Screenshots save to: ~/Desktop/
```

### Step 5: Verify Size
```bash
# Check your screenshot dimensions
file ~/Desktop/Simulator\ Screenshot*.png

# Should show: 1284 x 2778
```

---

## Method 2: Using Command Line (Automated)

### Quick Screenshot Script
```bash
#!/bin/bash
# Save as: take_screenshots.sh

echo "Taking screenshots on iPhone 14 Pro Max simulator..."

# Boot iPhone 14 Pro Max
xcrun simctl boot "iPhone 14 Pro Max" 2>/dev/null || true

# Wait for simulator
sleep 2

# Open your app (replace with your bundle ID)
# xcrun simctl launch "iPhone 14 Pro Max" com.ahmedahmedov.thunderyds

echo "Now manually navigate to each screen and press Cmd+S"
echo "Screenshots will save to Desktop"
```

---

## Method 3: Fix Existing Screenshots (Resize)

### If you have wrong-sized screenshots, convert them:

```bash
# Using ImageMagick (install with: brew install imagemagick)

# Resize to correct dimensions (1284×2778)
convert your_screenshot.png -resize 1284x2778! ~/Desktop/screenshot_01.png

# Or maintain aspect ratio with padding
convert your_screenshot.png -resize 1284x2778 -background black -gravity center -extent 1284x2778 ~/Desktop/screenshot_01.png
```

### Using sips (Built-in macOS)
```bash
# Resize screenshot
sips -z 2778 1284 your_screenshot.png --out ~/Desktop/fixed_screenshot.png
```

---

## Screenshots You Need

Take **3-5 screenshots** showing these screens:

1. **Welcome Screen**
   - Shows "Start Quiz" and "Flashcards" buttons
   
2. **Quiz Question**
   - Shows fill-in-the-blank sentence
   - Shows 5 answer options (A-E)
   
3. **Answer Explanation**
   - Shows correct answer highlighted
   - Shows explanation text
   
4. **Flashcard Mode**
   - Shows word card with definition
   - Shows "Don't Know" and "Know" buttons
   
5. **Progress/Streak** (if you have this screen)

---

## Common Issues & Fixes

### Issue: Screenshot is wrong size
```bash
# Check current size
file screenshot.png

# If not 1284×2778, resize it
sips -z 2778 1284 screenshot.png --out fixed.png
```

### Issue: Simulator won't start
```bash
# Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all  # WARNING: This deletes all simulator data
```

### Issue: App not installed on simulator
```bash
# In Xcode, select iPhone 14 Pro Max and click Run
# Or manually install:
xcrun simctl install "iPhone 14 Pro Max" /path/to/YourApp.app
```

---

## Quick Checklist

- [ ] Open Xcode
- [ ] Select iPhone 14 Pro Max simulator
- [ ] Run your app
- [ ] Navigate to welcome screen → Cmd+S
- [ ] Navigate to quiz screen → Cmd+S
- [ ] Navigate to answer screen → Cmd+S
- [ ] Navigate to flashcard screen → Cmd+S
- [ ] Check Desktop for screenshots
- [ ] Verify size: 1284 × 2778 pixels
- [ ] Drag screenshots to App Store Connect

---

## Upload to App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Select your app → iOS App → 1.0 Prepare for Submission
3. Scroll to "Screenshots"
4. Make sure "iPhone 6.5" Display" is selected
5. Drag and drop your screenshots (1284×2778px)
6. Wait for upload and processing

---

## Alternative: Use App Store Screenshot Generator

If you can't get exact sizes, use these tools:

1. **AppLaunchpad** - https://theapplaunchpad.com/
2. **AppScreens** - https://appscreens.com/
3. **ScreenshotGenerator** - https://screenshotgenerator.com/

These let you design screenshots and export in correct sizes.
