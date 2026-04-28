# Clipped

## Your Learning Archive, Context Preserved 

Every learner has a graveyard of closed tabs - perfect 
explanations, clever analogies, "explain like I'm five" 
moments that clicked once and disappeared forever.
The old workflow was painful. Copy the text. Switch tabs. 
Open your notes app. Paste. Add context. Repeat 10 times 
a day until you give up.

Clipped is built to eliminate that friction entirely.

Highlight any text on any webpage, AI chat, or article 
and save it instantly - word for word, automatically tagged, 
organised by topic, and wrapped with AI-generated context 
so it still makes sense when you come back to it weeks later.

No switching tabs. No copy pasting. No losing the moment.
Just highlight, save, and keep reading.

---

## The Web App

<img width="1902" height="892" alt="image" src="https://github.com/user-attachments/assets/304678d8-f7ab-4e38-9e25-1d1b18d57605" />

##    

<img width="1907" height="902" alt="image" src="https://github.com/user-attachments/assets/4307d7a6-b83e-4c5b-82b4-0d3cf4dc83ee" />




---

## Features

- **Clip anything** - paste text from Claude, ChatGPT, Gemini, articles, or anywhere
- **AI-written titles and summaries** - Clipped reads your existing notes for context, then writes a short title and summary for each new clip
- **Preserved original** - the clipped text is never paraphrased, always shown exactly as you saved it
- **Topics and tags** - organize clips into topics (e.g. "React", "System Design") with tags: concept / example / quote
- **Search** - full-text search across all your clips
- **Dark mode** - toggle between light and dark
- **Chrome extension (V2)** - clip text from any webpage without leaving the page
  - Floating panel appears on text selection
  - Session Mode: start a topic session and auto-save clips silently as you read
  - Keyboard shortcut `Alt+C` (Windows/Linux) / `Option+C` (Mac) to save highlighted text instantly
  - Works on any site - uses shadow DOM so it never conflicts with page styles

---

## How it works

There are two ways to use Clipped depending on how you're learning.

### Way 1 - The app (when you're jumping between topics)

You're reading different things across different subjects. You open Clipped, paste the text that clicked, pick a topic, pick a tag, and hit **Add to notes**. Your configured AI model reads your existing notes from that topic for context, writes a short title and 1-2 line summary, and stores your clip with the original text preserved in an amber block - word for word, never paraphrased.

Good for: saving standout explanations from AI chats, articles, or docs where your notes are scattered across topics.

### Way 2 - The Chrome extension (when you're deep in one thing)

You're reading an article, a thread, or analysing information for a research paper and want to save related things on the go

**Option A - Highlight and save:** Select any text on the page. A floating panel appears below your selection. Choose your topic and tag, click **Save to Clipped**. Done- no tab switching.

**Option B - Session Mode:** You're going deep on one topic for a while. Open the extension popup, type your topic name, hit **Start Session**. Now every time you press `Alt+C` (Windows/Linux) / `Option+C` (Mac) with text highlighted, it saves silently to that topic - no panel, no clicks, just a small toast confirmation. End the session when you're done.

Good for: research sessions, reading streaks, or any time you want to stay in the flow and collect clips in the background.

Note - You can go to "Manage Extensions" in Chrome settings and turn off the extension after use.

---

## Tech stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React + Vite + Tailwind CSS          |
| Backend   | Node.js + Express                    |
| Database  | Supabase (PostgreSQL)                |
| AI        | OpenAI (gpt-4o-mini) or Google Gemini (gemini-2.5-flash) |
| Extension | Chrome Manifest V3, Vanilla JS       |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier is fine)
- At least one LLM API key -[Google AI Studio](https://aistudio.google.com) (Gemini, free tier) or [OpenAI](https://platform.openai.com/api-keys) (gpt-4o-mini, pay-as-you-go)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/clipped.git
cd clipped
```

### 2. Set up Supabase

Create a new Supabase project. Run the following SQL in the Supabase SQL editor:

```sql
create table topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text,
  created_at timestamptz default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  summary text,
  preserved_clip text,
  tag text,
  source text,
  topic_id uuid references topics(id) on delete cascade,
  created_at timestamptz default now()
);

create table settings (
  id integer primary key default 1,
  anthropic_api_key text,
  openai_api_key text
);
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your Supabase project URL and anon key:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3001
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Start the backend

```bash
cd backend
npm run dev
```

### 7. Start the frontend

```bash
cd frontend
npm run dev
```

### 8. Add your LLM API key

You have two options -pick whichever suits you:

**Option A -via the app Settings page** (no config file needed)

Open the app at `http://localhost:5173`, go to **Settings**. You'll see separate fields for OpenAI and Gemini. Add at least one. Keys are stored in Supabase and used server-side only. If both are saved, OpenAI takes precedence.

**Option B -via `backend/.env`** (takes priority over the Settings page)

Add one or both keys to your `.env` file:

```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
```

If both are set, OpenAI is used.

### 9. Load the Chrome extension (optional)

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `/extension` folder from this repo
5. The Clipped icon appears in your Chrome toolbar

**First-time setup:**

1. Make sure the backend is running (`npm run dev` in `/backend`)
2. Click the Clipped icon on extensions page → **Options** (or right-click → Options)
3. The default backend URL is `http://localhost:3001` - click **Test connection** to confirm it's working
4. If you've deployed the backend, update the URL and save

**Using the extension:**

- **Floating panel** -highlight any text (20+ characters) on any page and a panel appears below your selection. Pick a topic and tag, click Save.
- **Session Mode** - click the extension icon on chrome toolbar, type a topic name, hit **Start Session**. Everything you highlight in that tab gets saved to that topic automatically. Press `Alt+C` (Windows/Linux) / `Option+C` (Mac) to clip with a keyboard shortcut.
- **End session** by clicking the extension icon again and hitting **End Session**.

---

## LLM configuration

Clipped supports **Google Gemini** and **OpenAI**. You need at least one. If both are configured, OpenAI takes precedence.

| Provider | Model | Cost |
|----------|-------|------|
| Gemini | `gemini-2.5-flash` | Free tier: 1,500 req/day, no credit card |
| OpenAI | `gpt-4o-mini` | Pay-as-you-go, very cheap for personal use |

**Two ways to configure:**

1. **Settings page** (in-app) -go to Settings and enter your key(s) directly. Stored in Supabase, never exposed to the browser.
2. **`.env` file** -add `OPENAI_API_KEY` and/or `GEMINI_API_KEY` to `backend/.env`. Takes priority over the Settings page.

Get keys: [Google AI Studio](https://aistudio.google.com) · [OpenAI Platform](https://platform.openai.com/api-keys)

---

## Contributing

Contributions are welcome - bug fixes, features, UI improvements, or documentation.

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started. First-time contributors are very welcome.

---

## License

MIT - see [LICENSE](LICENSE).
