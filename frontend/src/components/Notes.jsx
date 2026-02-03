import { useState, useEffect } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notes.js";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteData, setEditingNoteData] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const { data } = await getNotes();
      setNotes(data);
    } catch (err) {
      alert(err.response?.data?.message || "Could not fetch notes");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) return alert("Title is required");
    try {
      const { data } = await createNote(newNote);
      setNotes((prev) => [data, ...prev]);
      setNewNote({ title: "", description: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add note");
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setEditingNoteData({ title: note.title, description: note.description });
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteData({ title: "", description: "" });
  };

  const handleSaveEdit = async (noteId) => {
    if (!editingNoteData.title.trim()) return alert("Title is required");
    try {
      const { data } = await updateNote(noteId, editingNoteData);
      setNotes((prev) => prev.map((n) => (n._id === noteId ? data : n)));
      cancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update note");
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    try {
      await deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-left">
      <h2 className="text-xl font-semibold mb-3">Add a note</h2>
      <form onSubmit={handleAddNote} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
        />
        <textarea
          placeholder="Description"
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" type="submit">Add</button>
          <button type="button" onClick={() => setNewNote({ title: "", description: "" })} className="px-4 py-2 rounded-lg bg-gray-300 cursor-pointer">Clear</button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-3">Your notes</h2>

      {loadingNotes ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes yet</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="border rounded-lg p-4 bg-gray-50">
              {editingNoteId === note._id ? (
                <>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
                    value={editingNoteData.title}
                    onChange={(e) => setEditingNoteData({ ...editingNoteData, title: e.target.value })}
                  />
                  <textarea
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2"
                    value={editingNoteData.description}
                    onChange={(e) => setEditingNoteData({ ...editingNoteData, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveEdit(note._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">Save</button>
                    <button onClick={cancelEdit} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{note.title}</h3>
                      <p className="text-sm text-gray-700 mt-1">{note.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(note)} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(note._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">Delete</button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(note.createdAt).toLocaleString()}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
