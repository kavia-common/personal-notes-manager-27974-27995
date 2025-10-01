 // PUBLIC_INTERFACE
/**
 * API client for Notes backend.
 * Uses BASE_URL from environment or window.env to allow CORS-safe absolute requests.
 * Default fallback points to backend at http://localhost:3001.
 * Set REACT_APP_API_BASE_URL in .env to override for deployments.
 */
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (typeof window !== 'undefined' && window.env && window.env.API_BASE_URL) ||
  'http://localhost:3001';

// Helper to handle JSON and errors
async function http(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const contentType = resp.headers.get('content-type') || '';
  let payload = null;
  if (contentType.includes('application/json')) {
    payload = await resp.json();
  } else {
    payload = await resp.text();
  }
  if (!resp.ok) {
    const message = (payload && payload.detail) || payload || `Request failed: ${resp.status}`;
    const error = new Error(message);
    error.status = resp.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

// PUBLIC_INTERFACE
export async function getNotes() {
  /** Fetch all notes. Returns an array of notes: [{id, title, content, created_at?, updated_at?}] */
  return http('/notes', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /** Create a new note. Expects {title, content}. Returns created note. */
  return http('/notes', { method: 'POST', body: JSON.stringify(note) });
}

// PUBLIC_INTERFACE
export async function updateNote(id, note) {
  /** Update an existing note by id. Expects {title, content}. Returns updated note. */
  return http(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(note) });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns {success: true} or deleted note per backend. */
  return http(`/notes/${id}`, { method: 'DELETE' });
}

export { BASE_URL };
