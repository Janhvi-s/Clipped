import React, { useState } from 'react';

const TAG_STYLES = {
  concept: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  example: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  quote:   'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

const TAGS = ['concept', 'example', 'quote'];
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

function isUrl(s) { try { return Boolean(new URL(s)); } catch { return false; } }
function shortUrl(s) { try { return new URL(s).hostname.replace(/^www\./, ''); } catch { return s; } }
function fmt(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoteCard({ note, onDelete, onUpdate, topics }) {
  const [editing, setEditing] = useState(false);
  const [editTag, setEditTag] = useState(note.tag || 'concept');
  const [editClip, setEditClip] = useState(note.preserved_clip);
  const [editSource, setEditSource] = useState(note.source || '');
  const [editTopicName, setEditTopicName] = useState(note.topics?.name || '');
  const [saving, setSaving] = useState(false);

  const tag = note.tag || 'concept';

  async function resolveTopicId(name) {
    if (!name.trim()) return { topicId: null, newTopic: null };
    const existing = (topics || []).find((t) => t.name.toLowerCase() === name.trim().toLowerCase());
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

  async function handleSave() {
    setSaving(true);
    try {
      const { topicId, newTopic } = await resolveTopicId(editTopicName);
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: editTag, preserved_clip: editClip, source: editSource, topic_id: topicId }),
      });
      const updated = await res.json();
      if (res.ok) {
        onUpdate(updated, newTopic);
        setEditTag(updated.tag || 'concept');
        setEditClip(updated.preserved_clip);
        setEditSource(updated.source || '');
        setEditTopicName(updated.topics?.name || '');
        setEditing(false);
      }
    } finally { setSaving(false); }
  }

  function handleCancel() {
    setEditTag(note.tag || 'concept');
    setEditClip(note.preserved_clip);
    setEditSource(note.source || '');
    setEditTopicName(note.topics?.name || '');
    setEditing(false);
  }

  const fieldCls = 'w-full text-[12px] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${TAG_STYLES[tag] || TAG_STYLES.concept}`}>
            {tag}
          </span>
          {note.topics && (
            <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: note.topics.color }} />
              {note.topics.name}
            </span>
          )}
          <span className="text-[11px] text-gray-400">{fmt(note.date)}</span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              title="Edit"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6M10 11v6m4-6v6M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Title + summary */}
      <div>
        <h3 className="font-semibold text-[16px] leading-snug text-gray-900 dark:text-gray-100">
          {note.title}
        </h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{note.summary}</p>
      </div>

      {/* Clip / Edit area */}
      {editing ? (
        <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Tag */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">Tag</p>
            <div className="flex gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEditTag(t)}
                  className={`flex-1 py-1.5 text-[11px] rounded-md border font-medium uppercase tracking-wider transition-colors ${
                    editTag === t
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
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Source</p>
            <input value={editSource} onChange={(e) => setEditSource(e.target.value)} placeholder="Claude, ChatGPT…" className={fieldCls} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Topic</p>
            <input value={editTopicName} onChange={(e) => setEditTopicName(e.target.value)} placeholder="e.g. React, System Design…" className={fieldCls} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Preserved clip</p>
            <textarea
              value={editClip}
              onChange={(e) => setEditClip(e.target.value)}
              rows={5}
              className="w-full text-[12px] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-amber-50 dark:bg-amber-950/30 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-[12px] font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button onClick={handleCancel} className="flex-1 py-2 text-[12px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg px-4 py-3">
          <p className="text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {note.preserved_clip}
          </p>
        </div>
      )}

      {/* Footer */}
      {!editing && (
        <p className="text-[11px] text-gray-400 pt-1">
          Preserved from{' '}
          {isUrl(note.source) ? (
            <a
              href={note.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-700 underline underline-offset-2 transition-colors"
              title={note.source}
            >
              {shortUrl(note.source)}
            </a>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{note.source}</span>
          )}{' '}
          · {fmt(note.date)}
        </p>
      )}
    </article>
  );
}
