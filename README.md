# Clipped

** Your Learning Archive, Context Preserved **

Every learner has a graveyard of closed tabs — perfect 
explanations, clever analogies, "explain like I'm five" 
moments that clicked once and disappeared forever.

The old workflow was painful. Copy the text. Switch tabs. 
Open your notes app. Paste. Add context. Repeat 10 times 
a day until you give up.

Clipped is built to eliminate that friction entirely.

Highlight any text on any webpage, AI chat, or article 
and save it instantly — word for word, automatically tagged, 
organised by topic, and wrapped with AI-generated context 
so it still makes sense when you come back to it weeks later.

No switching tabs. No copy pasting. No losing the moment.
Just highlight, save, and keep reading.

---

## Screenshots

> _Screenshots coming soon_

---

## Features

- **Clip anything** — paste text from Claude, ChatGPT, Gemini, articles, or anywhere
- **AI-written titles and summaries** — Gemini reads your existing notes for context, then writes a short title and summary for each new clip
- **Preserved original** — the clipped text is never paraphrased, always shown exactly as you saved it
- **Topics and tags** — organize clips into topics (e.g. "React", "System Design") with tags: concept / example / quote
- **Search** — full-text search across all your clips
- **Dark mode** — toggle between light and dark
- **Chrome extension (V2)** — clip text from any webpage without leaving the page
  - Floating panel appears on text selection
  - Session Mode: start a topic session and auto-save clips silently as you read
  - Keyboard shortcut `Alt+C` to save highlighted text instantly
  - Works on any site — uses shadow DOM so it never conflicts with page styles

---

## How it works

1. **Clip** — paste or highlight the exact text that helped you understand something
2. **Tag** — choose a topic and tag (concept, example, or quote)
3. **AI processes** — Gemini reads your existing notes from that topic for context, then writes a title and 1-2 line summary
4. **Saved** — your note is stored with the original clip preserved in an amber block, ready to revisit

---

## Tech stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React + Vite + Tailwind CSS          |
| Backend   | Node.js + Express                    |
| Database  | Supabase (PostgreSQL)                |
| AI        | Google Gemini API (gemini-2.5-flash) |
| Extension | Chrome Manifest V3, Vanilla JS       |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier is fine)
- A [Google AI Studio](https://aistudio.google.com) account for a Gemini API key

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
  gemini_api_key text
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

### 8. Add your Gemini API key

Open the app at `http://localhost:5173`, go to **Settings**, and paste your Gemini API key. It's stored in Supabase — no environment variable needed on the frontend.

### 9. Load the Chrome extension (optional)

See [extension/README.md](extension/README.md) for step-by-step instructions to load the extension in Chrome.

---

## API cost

Clipped uses the **Google Gemini API** (`gemini-2.5-flash`).

- Free tier: **1,500 requests/day** — no credit card required
- Each "Add to notes" click uses one API call
- For personal use, the free tier is more than enough

Get your key at [aistudio.google.com](https://aistudio.google.com).

---

## Contributing

Contributions are welcome — bug fixes, features, UI improvements, or documentation.

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started. First-time contributors are very welcome.

---

## License

MIT — see [LICENSE](LICENSE).
