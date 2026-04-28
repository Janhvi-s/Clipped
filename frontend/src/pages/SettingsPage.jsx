import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      setHasKey(d.hasKey);
      setMaskedKey(d.maskedKey || '');
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setSaving(true); setError(''); setSaved(false);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anthropic_api_key: apiKey.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to save');
    } else {
      setSaved(true); setHasKey(true); setApiKey('');
      const d2 = await fetch('/api/settings').then((r) => r.json());
      setMaskedKey(d2.maskedKey || '');
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center gap-3">
        <Link to="/" className="text-[13px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
        <span className="text-gray-300 dark:text-gray-700">·</span>
        <h1 className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Settings</h1>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 pt-6 pb-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-[18px] text-gray-900 dark:text-gray-100">API Configuration</h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Your key is stored in Supabase and used server-side only — never exposed to the browser.
            </p>
          </div>

          <div className="px-6 py-6 space-y-5">
            {hasKey && maskedKey && (
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <p className="text-[13px] text-green-700 dark:text-green-400 font-mono">{maskedKey}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {hasKey ? 'Replace key' : 'Gemini API key'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza…"
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
                disabled={saving || !apiKey.trim()}
                className="w-full py-2.5 bg-indigo-600 text-white text-[13px] font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving…' : 'Save key'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
