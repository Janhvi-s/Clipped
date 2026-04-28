import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import NotesFeed from '../components/NotesFeed.jsx';
import ClipPanel from '../components/ClipPanel.jsx';

export default function MainPage() {
  const [topics, setTopics] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [search, setSearch] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => { fetchTopics(); }, []);
  useEffect(() => { fetchNotes(); }, [selectedTopicId, search]);

  async function fetchTopics() {
    const res = await fetch('/api/topics');
    const data = await res.json();
    setTopics(Array.isArray(data) ? data : []);
  }

  async function fetchNotes() {
    setNotesLoading(true);
    const params = new URLSearchParams();
    if (selectedTopicId) params.set('topic_id', selectedTopicId);
    if (search) params.set('search', search);
    const res = await fetch(`/api/notes?${params}`);
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
    setNotesLoading(false);
  }

  async function handleCreateTopic(payload) {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) setTopics((prev) => [...prev, data]);
  }

  async function handleDeleteTopic(id) {
    await fetch(`/api/topics/${id}`, { method: 'DELETE' });
    setTopics((prev) => prev.filter((t) => t.id !== id));
    if (selectedTopicId === id) setSelectedTopicId(null);
  }

  async function handleDeleteNote(id) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function handleUpdateNote(updated, newTopic) {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    if (newTopic) setTopics((prev) => [...prev, newTopic]);
  }

  function handleNoteAdded(note, newTopic) {
    setNotes((prev) => [note, ...prev]);
    if (newTopic) setTopics((prev) => [...prev, newTopic]);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        topics={topics}
        selectedTopicId={selectedTopicId}
        onSelectTopic={setSelectedTopicId}
        onCreateTopic={handleCreateTopic}
        onDeleteTopic={handleDeleteTopic}
      />
      <NotesFeed
        notes={notes}
        loading={notesLoading}
        search={search}
        onSearchChange={setSearch}
        onDeleteNote={handleDeleteNote}
        onUpdateNote={handleUpdateNote}
        topics={topics}
      />
      <ClipPanel topics={topics} onNoteAdded={handleNoteAdded} />
    </div>
  );
}
