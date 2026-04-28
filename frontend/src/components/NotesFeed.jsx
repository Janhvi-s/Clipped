import React from 'react';
import NoteCard from './NoteCard.jsx';

export default function NotesFeed({ notes, loading, search, onSearchChange, onDeleteNote, onUpdateNote, topics }) {
  return (
    <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden dark:bg-gray-950" style={{ background: '#ddd6fe' }}>
      {/* Search bar */}
      <div className="px-8 pt-6 pb-4 border-b border-violet-200 dark:border-gray-800">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search across all notes…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-[13px]">
            Loading…
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
            <p className="text-[13px]">
              {search ? 'No notes match your search.' : 'Nothing clipped yet.'}
            </p>
          </div>
        ) : (
          notes.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDeleteNote}
              onUpdate={onUpdateNote}
              topics={topics}
            />
          ))
        )}
      </div>
    </main>
  );
}
