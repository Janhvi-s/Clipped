# Clipped — Chrome Extension

Highlight any text on any webpage and save it straight to your Clipped notes.
The AI writes the title and summary automatically, just like the web app.

## How to load in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `/extension` folder from this repo
5. The Clipped icon appears in your Chrome toolbar

## First-time setup

1. Make sure the Clipped backend is running:
   ```bash
   cd backend
   npm run dev
   ```
2. Click the Clipped icon in the toolbar → **Options** (or right-click → Options)
3. The default backend URL is `http://localhost:3001` — click **Test connection** to verify
4. If you've deployed the backend remotely, update the URL and save

## Usage

1. Go to any webpage (ChatGPT, Claude, Medium, docs, etc.)
2. **Highlight** at least 20 characters of text
3. A floating panel slides in just below your selection:
   - **Preview** of the highlighted text (amber block)
   - **Source** auto-detected from the page hostname
   - **Topic** dropdown — pick an existing topic or leave blank
   - **Tag** selector — concept / example / quote
4. Click **Save to Clipped**
5. The AI generates a title and summary, the note is saved, and the panel closes after 2 seconds
6. The note appears instantly in your Clipped web app

## Files

```
extension/
├── manifest.json        Manifest V3 config
├── background.js        Service worker — sets default storage on install
├── content.js           Injected into every page — floating panel via shadow DOM
├── options.html         Settings page UI
├── options.js           Settings page logic
├── options.css          Settings page styles
├── generate-icons.js    Script to regenerate icon PNGs (node generate-icons.js)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Notes

- The panel uses **shadow DOM** so it never conflicts with the host page's CSS
- The backend URL is stored in `chrome.storage.sync` and survives browser restarts
- CORS is open on the backend (`cors()` with no restrictions), so requests from the extension work out of the box
- Clicking anywhere outside the panel closes it
- The panel repositions itself if it would go off-screen edges
