import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Sidebar({ topics, selectedTopicId, onSelectTopic, onCreateTopic, onDeleteTopic }) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  function toggleDark() {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateTopic({ name: newName.trim(), color: newColor });
    setNewName('');
    setNewColor(COLORS[0]);
    setShowForm(false);
  }

  return (
    <aside className="w-[220px] flex-shrink-0 h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Notepad body */}
            <rect x="5" y="7" width="22" height="22" rx="3" fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeWidth="1.6"/>
            {/* Spiral holes */}
            <circle cx="10" cy="7" r="1.5" fill="#6366f1" fillOpacity="0.5"/>
            <circle cx="16" cy="7" r="1.5" fill="#6366f1" fillOpacity="0.5"/>
            <circle cx="22" cy="7" r="1.5" fill="#6366f1" fillOpacity="0.5"/>
            {/* Top binding bar */}
            <rect x="5" y="5.5" width="22" height="3" rx="1.5" fill="#6366f1" fillOpacity="0.25" stroke="#6366f1" strokeWidth="1.2"/>
            {/* Lines */}
            <line x1="9" y1="15" x2="23" y2="15" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="9" y1="19.5" x2="23" y2="19.5" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="9" y1="24" x2="17" y2="24" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round"/>
            {/* Tiny pen/pencil */}
            <line x1="20" y1="24.5" x2="25" y2="19.5" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
            <polygon points="25,19.5 26.5,21 24.5,22" fill="#f59e0b"/>
            <line x1="19.5" y1="25" x2="20" y2="24.5" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Clipped</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5 ml-0.5">Your learning archive</p>
      </div>

      {/* Topics nav */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <button
          onClick={() => onSelectTopic(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
            selectedTopicId === null
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
          All notes
        </button>

        {topics.map((topic) => (
          <div key={topic.id} className="group relative">
            <button
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                selectedTopicId === topic.id
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: topic.color }} />
              <span className="truncate">{topic.name}</span>
            </button>
            <button
              onClick={() => onDeleteTopic(topic.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-[11px] px-1 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <Link
          to="/settings"
          className="flex items-center gap-2 px-5 py-3 text-[12px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          Settings
        </Link>

        <button
          onClick={toggleDark}
          className="w-full flex items-center justify-between px-5 py-3 text-[12px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors border-t border-gray-200 dark:border-gray-800"
        >
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          <span className={`relative w-8 h-[18px] rounded-full transition-colors duration-300 ${isDark ? 'bg-indigo-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-[3px] w-3 h-3 rounded-full bg-white shadow transition-transform duration-300 ${isDark ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
          </span>
        </button>

        <div className="border-t border-gray-200 dark:border-gray-800 p-3">
          {showForm ? (
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                autoFocus
                type="text"
                placeholder="Topic name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-[12px] border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`w-4 h-4 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-offset-1 ring-indigo-500' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                <button type="submit" className="flex-1 py-1 text-[11px] font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Add
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-1 text-[11px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-base leading-none">+</span>
              New topic
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
