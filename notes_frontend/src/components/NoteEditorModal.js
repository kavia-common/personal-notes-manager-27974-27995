import React, { useEffect, useState } from 'react';

/**
 * Controlled modal for creating/editing a note.
 * Props:
 * - open: boolean
 * - onClose: function
 * - onSave: function({title, content})
 * - initial: {title, content} optional
 */
// PUBLIC_INTERFACE
export default function NoteEditorModal({ open, onClose, onSave, initial }) {
  /** Modal renders when open, providing title/content editors and actions to save/cancel. */
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');

  useEffect(() => {
    setTitle(initial?.title || '');
    setContent(initial?.content || '');
  }, [initial, open]);

  if (!open) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), content });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Note Editor">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">{initial ? 'Edit Note' : 'New Note'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <label className="field-label" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="input"
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
            />
            <label className="field-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="textarea"
              placeholder="Write your note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{initial ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
