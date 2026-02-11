# Thunder YDS - Capacitor iOS App

## Project Overview

Thunder YDS is an AI-powered English vocabulary learning application for iOS, built with Capacitor. The app helps users master academic vocabulary for the YDS (Yabancı Dil Sınavı - Foreign Language Exam) through interactive quizzes and flashcard study modes.

The application is a hybrid mobile app that combines:
- **Frontend**: Single-page HTML/JavaScript application with iOS-native design system
- **Native Bridge**: Capacitor framework for iOS integration
- **Backend**: Netlify serverless function for AI-powered question generation

## Technology Stack

### Core Technologies
- **Capacitor 8.x**: Cross-platform native bridge for web apps
  - `@capacitor/core`: Core Capacitor functionality
  - `@capacitor/cli`: CLI tools for sync and build
  - `@capacitor/ios`: iOS platform integration
  - `@capacitor/toast`: Toast notifications plugin
- **Native iOS**: Swift-based iOS project with UIKit
- **Web Technologies**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI Model**: Mistral AI Ministral-8B via OpenRouter API (with fallback to mistralai/mistral-7b-instruct and openai/gpt-3.5-turbo)

### iOS Design System
The app implements Apple's iOS Human Interface Guidelines with:
- SF Pro font family (`-apple-system` font stack)
- iOS system colors (blue, green, red, orange, etc.)
- Dynamic Type with `clamp()` for responsive scaling
- iOS spring animations (`cubic-bezier(0.32, 0.72, 0, 1)`)
- Dark mode support via `prefers-color-scheme: dark`
- Safe area insets for notched devices

## Project Structure

```
17 Capacitor/
├── capacitor.config.json    # Capacitor configuration (appId, appName, webDir)
├── package.json             # Node.js dependencies and scripts
├── netlify.toml             # Netlify deployment configuration
├── netlify/
│   └── functions/
│       ├── generate-question.js  # Serverless function for AI question generation
│       └── package.json          # Function dependencies
├── www/                     # Web application source (deployed to iOS)
│   ├── index.html          # Single-page application (~2600 lines, 10 sections)
│   ├── words.json          # Vocabulary database (~1262 words)
│   └── capacitor.js        # Capacitor runtime
├── ios/                     # iOS native project
│   ├── App/
│   │   ├── App.xcodeproj/   # Xcode project
│   │   ├── CapApp-SPM/      # Swift Package Manager dependencies
│   │   └── App/
│   │       ├── AppDelegate.swift    # iOS app lifecycle
│   │       ├── Info.plist           # App metadata (Bundle display name: "Thunder YDS")
│   │       ├── config.xml           # Cordova compatibility
│   │       ├── capacitor.config.json # Capacitor config copy
│   │       ├── public/              # Synced web assets from www/
│   │       ├── Base.lproj/          # Storyboards (LaunchScreen.storyboard, Main.storyboard)
│   │       └── Assets.xcassets/     # App icons and splash screens
│   └── capacitor-cordova-ios-plugins/  # Cordova plugin compatibility
└── node_modules/            # npm dependencies
```

## Configuration Files

### `capacitor.config.json`
```json
{
  "appId": "com.example.helloworld",
  "appName": "Thunder YDS",
  "webDir": "www"
}
```

### `package.json`
- **App Name**: thunder-yds
- **Version**: 1.0.0
- **Type**: CommonJS
- **License**: ISC

### `netlify.toml`
- Build output: `www`
- Functions directory: `netlify/functions`
- Node version: 18
- API redirects: `/api/*` → `/.netlify/functions/:splat`
- Security headers: X-Frame-Options, X-XSS-Protection

## Application Architecture

### Web Application (`www/index.html`)
The entire app is contained in a single HTML file with embedded CSS and JavaScript (~2600 lines), organized into clear sections:

#### Code Organization (10 Sections)
| Section | Name | Description |
|---------|------|-------------|
| 0 | **Styles & Theme** | iOS Design System CSS with dark mode support |
| 1 | **Data Loading** | Dynamic vocabulary loading from `words.json` |
| 2 | **Configuration** | App settings, API configs, and AI prompt templates |
| 3 | **State Management** | AppState, FlashcardState, and global state containers |
| 4 | **Utility Functions** | Helpers for validation, formatting, DOM manipulation |
| 5 | **API Layer** | OpenRouter integration with circuit breaker pattern |
| 6 | **Streak System** | Daily progress tracking with persistence |
| 7 | **Flashcard Mode** | Tinder-style swipe study interface |
| 8 | **UI Renderers** | Quiz display, answer handling, screen transitions |
| 9 | **Initialization** | Event listeners and app bootstrap |

#### UI Sections
1. **Welcome Screen** (`welcome-minimal`): App intro with mode selection
2. **Quiz Mode** (`appPage`): Fill-in-the-blank vocabulary questions
3. **Flashcard Mode** (`flashcardPage`): Tinder-style swipe study cards

#### Core JavaScript Modules
- **AppState**: Global state management for quiz mode
- **FlashcardState**: State for flashcard study mode
- **StreakState**: Daily streak tracking with localStorage/native storage
- **CONFIG**: Application configuration (API settings, limits, prompts)
- **API_CONFIG**: API endpoint configuration
- **NativeStorage**: Bridge to native iOS storage via WKWebView message handlers
- **loadWordList()**: Async loader for vocabulary words from `words.json`

#### Word Database (`www/words.json`)
The vocabulary list (~1262 words) is stored in a separate JSON file for easier maintenance:
- Single words: "Abandon", "Abstract", "Abundant", etc.
- Phrasal verbs: "Account for", "Back up", "Break down", etc.
- Prepositional phrases: "In accordance with", "In terms of", etc.

### API Integration
```javascript
API_CONFIG = {
    endpoint: 'https://thunder.yds.today/.netlify/functions/generate-question',
    timeout: { wifi: 30000, cellular: 60000 }
}
```

The backend uses Mistral AI Ministral-8B model to generate:
- Contextual fill-in-the-blank questions
- 5 multiple-choice options with distractors
- Explanations for each option
- Flashcard definitions and example sentences

### Netlify Function (`netlify/functions/generate-question.js`)
- Proxies requests to OpenRouter API
- Securely stores API key in environment variables
- Implements fallback model selection
- CORS-enabled for cross-origin requests
- Validates API key format (must start with `sk-or-`)

### iOS Native Integration

#### AppDelegate.swift
Standard Capacitor `AppDelegate` that:
- Extends `UIResponder` and implements `UIApplicationDelegate`
- Handles URL schemes and Universal Links
- Uses `ApplicationDelegateProxy` for Capacitor API support

#### Info.plist
- Bundle display name: "Thunder YDS"
- Supports multiple orientations (portrait, landscape)
- Uses Main.storyboard for UI
- Includes Capacitor debug configuration (`CAPACITOR_DEBUG`)

## Build Commands

### Prerequisites
- Node.js 18+
- Xcode (for iOS development)
- iOS device or simulator

### Development
```bash
# Install dependencies
npm install

# Sync web assets to iOS project (required after any www/ changes)
npm run sync
# Or: npx cap sync

# Open iOS project in Xcode
npm run ios
# Or: npx cap open ios
```

### Running the App
```bash
# Run on connected iOS device or simulator
npm run ios:run
# Or: npx cap run ios
```

### Build
```bash
# No build step required (static HTML app)
npm run build
# Output: "No build step needed for this simple app"
```

## Development Workflow

### Making Changes
1. Edit `www/index.html` for web app changes
2. Run `npm run sync` to copy changes to iOS project
3. Run `npm run ios` to open Xcode and test on device/simulator

### iOS Build Process
1. `npx cap sync` copies `www/` to `ios/App/App/public/`
2. Xcode builds the Swift/Objective-C wrapper
3. Web assets are bundled as iOS app resources
4. Capacitor runtime bridges JavaScript to native APIs

## Key Features

### Quiz Mode
- AI-generated fill-in-the-blank questions
- 5 multiple choice options (A-E)
- Keyboard support (1-5, A-E, Enter, Escape)
- Answer explanations
- Streak tracking (20 words per day goal)
- Circuit breaker pattern for API failures

### Flashcard Mode
- Tinder-style swipe interface
- Swipe right = "Know", Swipe left = "Don't Know"
- AI-generated definitions and examples
- Gesture and button controls
- Prefetching for smooth UX

### Streak System
- Separate streaks for Quiz and Flashcard modes
- Daily goal: 20 words per mode
- Persistent storage via localStorage (with native storage bridge on iOS)
- Progress bars and celebration animations

### User Experience
- Offline detection with visual indicator
- Error boundaries for crash recovery
- Loading states and spinners
- Debounced button clicks (300ms)
- Rate limiting and circuit breaker protection
- Accessibility support (keyboard navigation, ARIA labels)

## Security Considerations

### Input Sanitization
- `sanitizeHtml()` function prevents XSS
- Word length limits (100 chars)
- Sentence truncation at 300 characters
- Option truncation at 60 characters

### API Safety
- Request timeout handling (30s WiFi, 60s cellular)
- Circuit breaker pattern (5 failures triggers 60s cooldown)
- AbortController for request cancellation
- Retry logic with exponential backoff (3 attempts)

### Data Storage
- LocalStorage used for streak persistence (with native iOS storage bridge)
- No sensitive user data stored locally
- API calls use HTTPS only
- API key stored in Netlify environment variables, never exposed to client

## Performance Optimizations

- **Prefetching**: Next question loaded while viewing current
- **Connection Detection**: Different timeouts for WiFi/cellular
- **Debouncing**: 300ms delay on button clicks
- **Animation**: Hardware-accelerated CSS transforms
- **Overscroll**: Disabled with `overscroll-behavior-y: none`
- **Will-change**: Applied to animated elements

## Testing Strategy

The project currently has no automated tests. Testing is manual via:
- Xcode Simulator (iPhone/iPad various sizes)
- Physical iOS devices
- Safari Web Inspector for debugging

## Deployment

### iOS App Store
1. Update version in Xcode project settings
2. Configure signing and provisioning profiles
3. Archive build in Xcode
4. Submit via App Store Connect

### Web Updates (Netlify)
The backend function is deployed to Netlify:
1. Push changes to git repository
2. Netlify auto-deploys from main branch
3. Set `OPENROUTER_API_KEY` in Netlify environment variables

### Important Note
Since web assets are bundled in the iOS app, any `www/index.html` changes require:
1. `npm run sync`
2. Rebuild and resubmit to App Store

## Dependencies

### Production
- `@capacitor/cli@^8.0.2`: Capacitor CLI
- `@capacitor/core@^8.0.2`: Core runtime
- `@capacitor/ios@^8.0.2`: iOS platform
- `@capacitor/toast@^8.0.0`: Toast notifications

## Code Style Guidelines

### JavaScript
- Use ES6+ features (const/let, arrow functions, async/await)
- Modular organization with clear section comments
- Debounced event handlers for performance
- Comprehensive JSDoc-style block comments for modules

### CSS
- CSS variables for theming (light/dark mode)
- Mobile-first responsive design
- iOS-specific design tokens
- Hardware-accelerated animations

### HTML
- Semantic HTML structure
- ARIA labels for accessibility
- Safe area insets for notched devices

## Notes for AI Agents

### Architecture
- This is a **single-file web app** - all logic is in `www/index.html`
- **10 clearly numbered sections** - maintain this organization when editing
- **External data**: Vocabulary words loaded from `words.json` (not hardcoded anymore)

### Development Workflow
- Changes to iOS native code should be minimal (Capacitor handles most bridging)
- Always run `npx cap sync` after modifying `www/` files
- The app uses a remote AI API - network connectivity is required for quiz generation
- Streak data is stored in localStorage (clears on app reinstall)

### Code Organization
When editing `index.html`, maintain the section structure:
```
/* ═════════════════════════════════════════════════════════════════════════════
   SECTION X: SECTION NAME
   Description of what this section does
   ═════════════════════════════════════════════════════════════════════════════ */
```

### Key Files
| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `www/index.html` | Main application | High |
| `www/words.json` | Vocabulary database | Low |
| `netlify/functions/generate-question.js` | AI proxy | Medium |
| `capacitor.config.json` | App config | Rare |
