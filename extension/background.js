chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ backendUrl: 'http://localhost:3001' });
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'clip-selection') {
    chrome.tabs.sendMessage(tab.id, { type: 'CLIP_SHORTCUT' });
  }
});
