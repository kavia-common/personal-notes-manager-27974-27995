//
// PUBLIC_INTERFACE
// Minimal API client for the Notes frontend.
// It reads REACT_APP_API_BASE_URL from environment variables and
// defaults to http://localhost:3001 to align with the FastAPI backend.
//
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });
  if (!resp.ok) {
    // Attempt to parse error if available
    let message = `Request failed with status ${resp.status}`;
    try {
      const data = await resp.json();
      if (data?.detail) message = data.detail;
    } catch (_) {}
    throw new Error(message);
  }
  // 204 No Content - nothing to parse
  if (resp.status === 204) return null;
  return resp.json();
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Fetch list of notes. */
  return request('/notes', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note. note: { title: string, content?: string } */
  return request('/notes', { method: 'POST', body: JSON.stringify(note) });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a note by id. */
  return request(`/notes/${id}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function updateNote(id, patch) {
  /** Update an existing note with provided fields. */
  return request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  return request(`/notes/${id}`, { method: 'DELETE' });
}

export default {
  listNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};
