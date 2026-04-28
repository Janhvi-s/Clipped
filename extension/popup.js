const viewActive    = document.getElementById('view-active');
const viewSetup     = document.getElementById('view-setup');
const pillTopicName = document.getElementById('pill-topic-name');
const topicInput    = document.getElementById('topic-input');
const topicSuggest  = document.getElementById('topic-suggestions');
const startBtn      = document.getElementById('start-btn');
const endBtn        = document.getElementById('end-btn');
const retryBtn      = document.getElementById('retry-btn');
const loadError     = document.getElementById('load-error');

let backendUrl = 'http://localhost:3001';
let knownTopics = []; // cache of { id, name, color } from backend

const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];

// ── Boot ─────────────────────────────────────────────────────────────────────

chrome.storage.sync.get(
  ['backendUrl', 'sessionActive', 'sessionTopicName'],
  (r) => {
    if (r.backendUrl) backendUrl = r.backendUrl;
    if (r.sessionActive && r.sessionTopicName) {
      showActive(r.sessionTopicName);
    } else {
      chrome.storage.sync.set({ sessionActive: false });
      showSetup();
      loadTopics();
    }
  }
);

// ── Views ─────────────────────────────────────────────────────────────────────

function showActive(topicName) {
  pillTopicName.textContent = topicName;
  viewActive.classList.remove('hidden');
  viewSetup.classList.add('hidden');
}

function showSetup() {
  viewActive.classList.add('hidden');
  viewSetup.classList.remove('hidden');
}

// ── Load topic suggestions ────────────────────────────────────────────────────

async function loadTopics() {
  loadError.classList.add('hidden');
  topicSuggest.innerHTML = '';
  knownTopics = [];

  try {
    const res = await fetch(`${backendUrl}/api/topics`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error();
    const topics = await res.json();
    if (Array.isArray(topics)) {
      knownTopics = topics;
      topics.forEach((t) => {
        const opt = document.createElement('option');
        opt.value = t.name;
        topicSuggest.appendChild(opt);
      });
    }
  } catch (_) {
    loadError.classList.remove('hidden');
  }
}

// ── Events ────────────────────────────────────────────────────────────────────

topicInput.addEventListener('input', () => {
  startBtn.disabled = !topicInput.value.trim();
});

retryBtn.addEventListener('click', loadTopics);

startBtn.addEventListener('click', async () => {
  const name = topicInput.value.trim();
  if (!name) return;

  startBtn.disabled = true;
  startBtn.textContent = 'Starting…';

  try {
    // Find existing topic (case-insensitive) or create a new one
    const existing = knownTopics.find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );

    let topicId, topicName;

    if (existing) {
      topicId   = existing.id;
      topicName = existing.name;
    } else {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const res = await fetch(`${backendUrl}/api/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });
      if (!res.ok) throw new Error('Could not create topic');
      const created = await res.json();
      topicId   = created.id;
      topicName = created.name;
    }

    chrome.storage.sync.set(
      { sessionActive: true, sessionTopicId: topicId, sessionTopicName: topicName },
      () => showActive(topicName)
    );
  } catch (err) {
    startBtn.disabled = false;
    startBtn.textContent = 'Start Session';
    loadError.textContent = err.message;
    loadError.classList.remove('hidden');
  }
});

endBtn.addEventListener('click', () => {
  chrome.storage.sync.set(
    { sessionActive: false, sessionTopicId: null, sessionTopicName: null },
    () => {
      topicInput.value = '';
      startBtn.disabled = true;
      startBtn.textContent = 'Start Session';
      showSetup();
      loadTopics();
    }
  );
});
