import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function KeyField({ label, placeholder, hint, hasKey, maskedKey, onSave, saving, saved, error }) {
  const [value, setValue] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    await onSave(value.trim());
    setValue('');
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">{label}</h2>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
      </div>
      <div className="px-6 py-5 space-y-4">
        {hasKey && maskedKey && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2.5">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <p className="text-[12px] text-green-700 dark:text-green-400 font-mono">{maskedKey}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
              {hasKey ? 'Replace key' : 'API key'}
            </label>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full text-[13px] font-mono border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          {error && (
            <p className="text-[12px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-[12px] text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
              Key saved successfully.
            </p>
          )}
          <button
            type="submit"
            disabled={saving || !value.trim()}
            className="w-full py-2.5 bg-indigo-600 text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : 'Save key'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [gemini, setGemini] = useState({ hasKey: false, maskedKey: '' });
  const [openai, setOpenai] = useState({ hasKey: false, maskedKey: '' });
  const [geminiState, setGeminiState] = useState({ saving: false, saved: false, error: '' });
  const [openaiState, setOpenaiState] = useState({ saving: false, saved: false, error: '' });

  useEffect(() => { loadKeys(); }, []);

  async function loadKeys() {
    const d = await fetch('/api/settings').then((r) => r.json());
    setGemini(d.gemini || { hasKey: false, maskedKey: '' });
    setOpenai(d.openai || { hasKey: false, maskedKey: '' });
  }

  async function saveGemini(key) {
    setGeminiState({ saving: true, saved: false, error: '' });
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: key }),
    });
    const data = await res.json();
    if (!res.ok) {
      setGeminiState({ saving: false, saved: false, error: data.error || 'Failed to save' });
    } else {
      setGeminiState({ saving: false, saved: true, error: '' });
      await loadKeys();
    }
  }

  async function saveOpenAI(key) {
    setOpenaiState({ saving: true, saved: false, error: '' });
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ openai_api_key: key }),
    });
    const data = await res.json();
    if (!res.ok) {
      setOpenaiState({ saving: false, saved: false, error: data.error || 'Failed to save' });
    } else {
      setOpenaiState({ saving: false, saved: true, error: '' });
      await loadKeys();
    }
  }

  const bothSet = gemini.hasKey && openai.hasKey;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center gap-3">
        <Link to="/app" className="text-[13px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
        <span className="text-gray-300 dark:text-gray-700">·</span>
        <h1 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Settings</h1>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-10 space-y-4">
        <div className="mb-2">
          <h2 className="font-semibold text-[18px] text-gray-900 dark:text-gray-100">API Configuration</h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            Keys are stored in Supabase and used server-side only, never exposed to the browser.
            {bothSet && (
              <span className="block mt-1 text-indigo-600 dark:text-indigo-400 font-medium">
                Both keys are set — OpenAI is active (takes precedence).
              </span>
            )}
          </p>
        </div>

        <KeyField
          label="OpenAI"
          placeholder="sk-…"
          hint="Uses gpt-4o-mini. Takes precedence over Gemini if both keys are set."
          hasKey={openai.hasKey}
          maskedKey={openai.maskedKey}
          onSave={saveOpenAI}
          saving={openaiState.saving}
          saved={openaiState.saved}
          error={openaiState.error}
        />

        <KeyField
          label="Google Gemini"
          placeholder="AIza…"
          hint="Uses gemini-2.5-flash. Free tier: 1,500 requests/day, no credit card required."
          hasKey={gemini.hasKey}
          maskedKey={gemini.maskedKey}
          onSave={saveGemini}
          saving={geminiState.saving}
          saved={geminiState.saved}
          error={geminiState.error}
        />
      </main>
    </div>
  );
}
