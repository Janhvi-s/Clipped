const urlInput = document.getElementById('backendUrl');
const saveBtn  = document.getElementById('saveBtn');
const testBtn  = document.getElementById('testBtn');
const statusEl = document.getElementById('status');

// Load saved URL
chrome.storage.sync.get(['backendUrl'], (r) => {
  urlInput.value = r.backendUrl || 'http://localhost:3001';
});

saveBtn.addEventListener('click', () => {
  const url = urlInput.value.trim().replace(/\/$/, '');
  if (!url) return;
  chrome.storage.sync.set({ backendUrl: url }, () => {
    showStatus('✓ Saved!', 'success');
  });
});

testBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim().replace(/\/$/, '');
  if (!url) return;

  testBtn.disabled = true;
  testBtn.textContent = 'Testing…';
  statusEl.textContent = '';
  statusEl.className = 'status';

  try {
    const res = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      showStatus('✓ Connected to backend successfully!', 'success');
    } else {
      showStatus(`✗ Backend returned ${res.status} ${res.statusText}`, 'error');
    }
  } catch (err) {
    showStatus('✗ Could not reach backend — is it running?', 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = 'Test connection';
  }
});

// Save on Enter
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveBtn.click();
});

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + type;
  clearTimeout(showStatus._timer);
  showStatus._timer = setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = 'status';
  }, 4000);
}
