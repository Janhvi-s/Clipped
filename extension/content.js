(function () {
  'use strict';

  let host = null;
  let backendUrl = 'http://localhost:3001';

  chrome.storage.sync.get(['backendUrl'], (r) => {
    if (r.backendUrl) backendUrl = r.backendUrl;
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.backendUrl) backendUrl = changes.backendUrl.newValue;
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== 'CLIP_SHORTCUT') return;
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text.length < 20) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    getSessionState().then((session) => {
      if (session.active) {
        const sourceText = window.location.href || window.location.hostname || 'Unknown';
        handleSessionSave(null, text, sourceText, session, () => 'concept', true);
      } else {
        openPanel(text, rect, session);
      }
    });
  });

  document.addEventListener('mousedown', (e) => {
    if (host && !host.contains(e.target)) closePanel();
  });

  document.addEventListener('mouseup', (e) => {
    if (host && host.contains(e.target)) return;
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text.length < 20) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    getSessionState().then((session) => {
      if (session.active) return;
      openPanel(text, rect, session);
    }).catch((err) => console.error('[Clipped] mouseup error:', err));
  });

  function closePanel() {
    if (host) { host.remove(); host = null; }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clamp(val, lo, hi) { return Math.max(lo, Math.min(hi, val)); }

  function computePosition(selRect, PH) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const PW = 300;

    const spaceBelow = vh - selRect.bottom;
    const spaceAbove = selRect.top;
    const spaceRight = vw - selRect.right;
    const spaceLeft  = selRect.left;

    if (spaceBelow >= PH + 15) {
      return { top: selRect.bottom + 10, left: clamp(selRect.left, 10, vw - PW - 10) };
    }
    if (spaceAbove >= PH + 15) {
      return { top: selRect.top - PH - 10, left: clamp(selRect.left, 10, vw - PW - 10) };
    }
    if (spaceRight >= PW + 15) {
      return { top: clamp(selRect.top, 10, vh - PH - 10), left: selRect.right + 10 };
    }
    if (spaceLeft >= PW + 15) {
      return { top: clamp(selRect.top, 10, vh - PH - 10), left: selRect.left - PW - 10 };
    }
    return { top: clamp(vh - PH - 10, 10, vh), left: clamp(vw - PW - 10, 10, vw) };
  }

  function getSessionState() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        ['sessionActive', 'sessionTopicId', 'sessionTopicName'],
        (r) => resolve({
          active:     !!r.sessionActive,
          topicId:    r.sessionTopicId || null,
          topicName:  r.sessionTopicName || '',
        })
      );
    });
  }

  function openPanel(selectedText, selRect, session) {
    closePanel();

    const estimatedHeight = session.active ? 285 : 375;
    const pos = computePosition(selRect, estimatedHeight);

    host = document.createElement('div');
    host.style.cssText = [
      'position:fixed',
      `left:${pos.left}px`,
      `top:${pos.top}px`,
      'z-index:2147483647',
      'pointer-events:auto',
    ].join(';');
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const preview = selectedText.length > 100
      ? selectedText.slice(0, 100) + '…'
      : selectedText;
    const sourceText = window.location.href || window.location.hostname || 'Unknown';

    shadow.innerHTML = buildPanel(preview, sourceText, session);

    // Tag state
    let activeTag = 'concept';
    shadow.querySelectorAll('.tag-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        shadow.querySelectorAll('.tag-btn').forEach((b) => { b.className = 'tag-btn'; });
        btn.classList.add(`active-${btn.dataset.tag}`);
        activeTag = btn.dataset.tag;
      });
    });

    shadow.querySelector('.close-btn').addEventListener('click', closePanel);

    if (session.active) {
      shadow.querySelector('.save-btn').addEventListener('click', () =>
        handleSessionSave(shadow, selectedText, sourceText, session, () => activeTag)
      );
    } else {
      shadow.querySelector('.save-btn').addEventListener('click', () =>
        handleSave(shadow, selectedText, sourceText, () => activeTag)
      );
      loadTopics(shadow);
    }
  }

  // ── Panel HTML builder ────────────────────────────────────────────────────

  function buildPanel(preview, sourceText, session) {
    const topicSection = session.active
      ? `<div class="session-pill">
           <span class="session-dot"></span>
           Session: <strong>${escapeHtml(session.topicName)}</strong>
         </div>`
      : `<div>
           <div class="field-label">Topic</div>
           <select class="topic-select">
             <option value="">— No topic —</option>
           </select>
         </div>`;

    const saveBtnStyle = session.active
      ? 'background:#7c3aed'
      : 'background:#6366f1';

    return `
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
.panel {
  width: 300px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  animation: pop .18s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes pop {
  from { opacity: 0; transform: scale(.94) translateY(-6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 13px;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}
.logo {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -.01em;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 13px;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .12s, color .12s;
}
.close-btn:hover { background: #e5e7eb; color: #374151; }
.body { padding: 12px 13px; display: flex; flex-direction: column; gap: 9px; }
.preview {
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  border-radius: 0 5px 5px 0;
  padding: 7px 10px;
  font-size: 12px;
  color: #78350f;
  line-height: 1.55;
  word-break: break-word;
}
.source-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #9ca3af;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.field-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: #9ca3af;
  margin-bottom: 5px;
}
.topic-select {
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #111827;
  outline: none;
  cursor: pointer;
}
.topic-select:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.15); }
.session-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(124,58,237,.08);
  border: 1px solid rgba(124,58,237,.22);
  color: #7c3aed;
  border-radius: 20px;
  padding: 5px 11px;
  font-size: 12px;
  font-weight: 500;
}
.session-dot {
  width: 7px;
  height: 7px;
  background: #7c3aed;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.tag-row { display: flex; gap: 5px; }
.tag-btn {
  flex: 1;
  padding: 5px 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  border-radius: 5px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #9ca3af;
  cursor: pointer;
  transition: all .12s;
}
.tag-btn:hover { border-color: #9ca3af; color: #374151; }
.active-concept { background: #2563eb !important; border-color: #2563eb !important; color: #fff !important; }
.active-example { background: #16a34a !important; border-color: #16a34a !important; color: #fff !important; }
.active-quote   { background: #7c3aed !important; border-color: #7c3aed !important; color: #fff !important; }
.save-btn {
  width: 100%;
  padding: 9px;
  ${saveBtnStyle};
  color: #ffffff;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background .12s;
}
.save-btn:hover:not(:disabled) { filter: brightness(1.1); }
.save-btn:disabled { opacity: .5; cursor: not-allowed; }
.status {
  font-size: 12px;
  text-align: center;
  padding: 2px 0;
  display: none;
}
.status.error { color: #dc2626; }
.status.success { color: #16a34a; font-weight: 600; }
</style>
<div class="panel">
  <div class="header">
    <div class="logo">
      <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="7" width="22" height="22" rx="3" fill="#6366f1" fill-opacity=".15" stroke="#6366f1" stroke-width="1.6"/>
        <rect x="5" y="5.5" width="22" height="3" rx="1.5" fill="#6366f1" fill-opacity=".25" stroke="#6366f1" stroke-width="1.2"/>
        <circle cx="10" cy="7" r="1.4" fill="#6366f1" fill-opacity=".6"/>
        <circle cx="16" cy="7" r="1.4" fill="#6366f1" fill-opacity=".6"/>
        <circle cx="22" cy="7" r="1.4" fill="#6366f1" fill-opacity=".6"/>
        <line x1="9" y1="15" x2="23" y2="15" stroke="#6366f1" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="9" y1="19.5" x2="23" y2="19.5" stroke="#6366f1" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="9" y1="24" x2="17" y2="24" stroke="#6366f1" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="20" y1="24.5" x2="25" y2="19.5" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      Clipped
    </div>
    <button class="close-btn" title="Close">✕</button>
  </div>
  <div class="body">
    <div class="preview">${escapeHtml(preview)}</div>
    <div class="source-row">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      ${escapeHtml(sourceText)}
    </div>
    ${topicSection}
    <div>
      <div class="field-label">Tag</div>
      <div class="tag-row">
        <button class="tag-btn active-concept" data-tag="concept">Concept</button>
        <button class="tag-btn" data-tag="example">Example</button>
        <button class="tag-btn" data-tag="quote">Quote</button>
      </div>
    </div>
    <button class="save-btn">Save to Clipped</button>
    <div class="status"></div>
  </div>
</div>`;
  }

  // ── Topic loader (normal mode only) ──────────────────────────────────────

  async function loadTopics(shadow) {
    try {
      const res = await fetch(`${backendUrl}/api/topics`);
      if (!res.ok) return;
      const topics = await res.json();
      if (!Array.isArray(topics)) return;
      const select = shadow.querySelector('.topic-select');
      topics.forEach((t) => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        select.appendChild(opt);
      });
    } catch (_) {}
  }

  // ── Normal save (with AI) ─────────────────────────────────────────────────

  async function handleSave(shadow, selectedText, sourceText, getTag) {
    const saveBtn   = shadow.querySelector('.save-btn');
    const statusEl  = shadow.querySelector('.status');
    const topicSelect = shadow.querySelector('.topic-select');

    const tag = getTag();
    const topicId   = topicSelect.value || null;
    const topicName = topicId
      ? (topicSelect.options[topicSelect.selectedIndex]?.textContent || 'General')
      : 'General';

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    statusEl.style.display = 'none';
    statusEl.className = 'status';

    try {
      let existingNotes = [];
      if (topicId) {
        const r = await fetch(`${backendUrl}/api/notes?topic_id=${topicId}`);
        if (r.ok) existingNotes = await r.json();
      }

      const aiRes = await fetch(`${backendUrl}/api/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clippedText: selectedText, source: sourceText, topicId, topicName, tag, existingNotes }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok) throw new Error(aiData.error || 'AI processing failed');

      const noteRes = await fetch(`${backendUrl}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiData),
      });
      if (!noteRes.ok) {
        const e = await noteRes.json();
        throw new Error(e.error || 'Failed to save note');
      }

      statusEl.textContent = '✓ Saved to Clipped!';
      statusEl.className = 'status success';
      statusEl.style.display = 'block';
      saveBtn.textContent = '✓ Saved!';
      saveBtn.style.background = '#16a34a';
      saveBtn.style.cursor = 'default';
      setTimeout(closePanel, 2000);
    } catch (err) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save to Clipped';
      statusEl.textContent = '⚠ ' + err.message;
      statusEl.className = 'status error';
      statusEl.style.display = 'block';
    }
  }

  // ── Session save (instant, no AI) ────────────────────────────────────────

  async function handleSessionSave(shadow, selectedText, sourceText, session, getTag, fromShortcut = false) {
    if (shadow) {
      shadow.querySelector('.save-btn').disabled = true;
      shadow.querySelector('.save-btn').textContent = 'Saving…';
      shadow.querySelector('.status').style.display = 'none';
    }

    try {
      const note = {
        title:          selectedText.slice(0, 80) + (selectedText.length > 80 ? '…' : ''),
        summary:        '',
        preserved_clip: selectedText,
        tag:            getTag(),
        topic_id:       session.topicId,
        source:         sourceText,
        date:           new Date().toISOString().split('T')[0],
      };

      const res = await fetch(`${backendUrl}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to save note');
      }

      if (fromShortcut) {
        showToast(`✓ Clipped to "${session.topicName}"`);
      } else if (shadow) {
        const saveBtn  = shadow.querySelector('.save-btn');
        const statusEl = shadow.querySelector('.status');
        statusEl.textContent = '✓ Saved to Clipped!';
        statusEl.className = 'status success';
        statusEl.style.display = 'block';
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = '#16a34a';
        saveBtn.style.cursor = 'default';
        setTimeout(closePanel, 2000);
      }
      // else: silent save from mouseup — no feedback
    } catch (err) {
      if (fromShortcut) {
        showToast('⚠ ' + err.message, false);
      } else if (!shadow) {
        // mouseup auto-save failed — show toast so user knows
        showToast('⚠ Save failed: ' + err.message, false);
      } else if (shadow) {
        const saveBtn  = shadow.querySelector('.save-btn');
        const statusEl = shadow.querySelector('.status');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save to Clipped';
        statusEl.textContent = '⚠ ' + err.message;
        statusEl.className = 'status error';
        statusEl.style.display = 'block';
      }
    }
  }

  function showToast(message, success = true) {
    const toastHost = document.createElement('div');
    toastHost.style.cssText = [
      'position:fixed',
      'top:20px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:2147483647',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(toastHost);
    const s = toastHost.attachShadow({ mode: 'open' });
    s.innerHTML = `
      <style>
        .toast {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${success ? '#15803d' : '#dc2626'};
          color: #fff;
          padding: 11px 20px;
          border-radius: 10px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 6px 24px rgba(0,0,0,.22);
          white-space: nowrap;
          animation: drop .22s cubic-bezier(.175,.885,.32,1.275) both;
        }
        @keyframes drop {
          from { opacity:0; transform:translateY(-10px) scale(.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      </style>
      <div class="toast">${escapeHtml(message)}</div>
    `;
    setTimeout(() => toastHost.remove(), 3000);
  }
})();
