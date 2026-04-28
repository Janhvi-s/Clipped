import React, { useState } from 'react';

const TAGS = ['concept', 'example', 'quote'];
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function ClipPanel({ topics, onNoteAdded }) {
  const [clip, setClip] = useState('');
  const [source, setSource] = useState('');
  const [topicName, setTopicName] = useState('');
  const [tag, setTag] = useState('concept');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function resolveTopicId(name) {
    if (!name.trim()) return { topicId: null, newTopic: null };
    const existing = topics.find((t) => t.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) return { topicId: existing.id, newTopic: null };
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), color }),
    });
    const newTopic = await res.json();
    if (!res.ok) throw new Error(newTopic.error || 'Failed to create topic');
    return { topicId: newTopic.id, newTopic };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clip.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { topicId, newTopic } = await resolveTopicId(topicName);
      let existingNotes = [];
      if (topicId) {
        const r = await fetch(`/api/notes?topic_id=${topicId}`);
        existingNotes = await r.json();
      }
      const aiRes = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clippedText: clip.trim(),
          source: source.trim() || 'Unknown',
          topicId,
          topicName: topicName.trim() || 'General',
          tag,
          existingNotes,
        }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok) throw new Error(aiData.error || 'AI processing failed');
      const noteRes = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiData),
      });
      const noteData = await noteRes.json();
      if (!noteRes.ok) throw new Error(noteData.error || 'Failed to save note');
      onNoteAdded(noteData, newTopic);
      setClip('');
      setSource('');
      setTopicName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full text-[13px] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';
  const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5';

  return (
    <aside className="w-[280px] flex-shrink-0 h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      <div className="px-5 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">New clip</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Paste text · AI writes the context</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div>
          <label className={labelCls}>Clipped text</label>
          <textarea
            value={clip}
            onChange={(e) => setClip(e.target.value)}
            placeholder="Paste the exact text you want to preserve…"
            rows={7}
            className={`${inputCls} resize-none leading-relaxed`}
          />
        </div>

        <div>
          <label className={labelCls}>Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Claude, ChatGPT, medium.com…"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Topic</label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="React, System Design…"
            className={inputCls}
          />
          <p className="text-[11px] text-gray-400 mt-1">Created automatically if new.</p>
        </div>

        <div>
          <label className={labelCls}>Tag</label>
          <div className="flex gap-1.5">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`flex-1 py-1.5 text-[10px] rounded-md border font-semibold uppercase tracking-wider transition-colors ${
                  tag === t
                    ? t === 'concept' ? 'bg-blue-600 border-blue-600 text-white'
                      : t === 'example' ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !clip.trim()}
          className="w-full py-2.5 bg-indigo-600 text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Writing context…' : 'Add to notes'}
        </button>

        {loading && (
          <p className="text-[11px] text-center text-gray-400 animate-pulse">
            AI is summarising your clip…
          </p>
        )}
      </form>
    </aside>
  );
}
