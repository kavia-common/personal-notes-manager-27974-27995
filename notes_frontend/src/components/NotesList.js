import React, { useEffect, useMemo, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api';
import NoteEditorModal from './NoteEditorModal';

/**
 * NotesList handles fetching and displaying notes with CRUD actions.
 */
// PUBLIC_INTERFACE
export default function NotesList() {
  /** Renders notes, provides add/edit/delete, and surfaces loading and errors. */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setErr('');
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : (data?.items || []));
    } catch (e) {
      setErr(e.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setEditorOpen(true);
  };

  const closeModal = () => {
    setEditorOpen(false);
    setEditing(null);
  };

  const handleSave = async ({ title, content }) => {
    try {
      setErr('');
      if (editing) {
        const updated = await updateNote(editing.id, { title, content });
        setNotes((prev) => prev.map((n) => (n.id === editing.id ? updated : n)));
      } else {
        const created = await createNote({ title, content });
        setNotes((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (e) {
      setErr(e.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setErr(e.message || 'Failed to delete note');
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <div className="page">
      <div className="toolbar">
        <input
          className="input search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn primary" onClick={openCreate} aria-label="Add Note">
          + New Note
        </button>
      </div>

      {err && <div className="alert error">{err}</div>}
      {loading ? (
        <div className="skeleton-list">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-card">
            <div className="empty-icon">🗒️</div>
            <div className="empty-text">No notes yet</div>
            <button className="btn primary" onClick={openCreate}>Create your first note</button>
          </div>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((note) => (
            <div key={note.id} className="card note-card">
              <div className="note-header">
                <h4 className="note-title">{note.title}</h4>
                <div className="note-actions">
                  <button className="icon-btn" onClick={() => openEdit(note)} title="Edit">✎</button>
                  <button className="icon-btn danger" onClick={() => handleDelete(note.id)} title="Delete">🗑︎</button>
                </div>
              </div>
              {note.content && <p className="note-content">{note.content}</p>}
            </div>
          ))}
        </div>
      )}

      <NoteEditorModal
        open={editorOpen}
        onClose={closeModal}
        onSave={handleSave}
        initial={editing ? { title: editing.title || '', content: editing.content || '' } : null}
      />
    </div>
  );
}
