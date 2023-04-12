import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import axios from "axios";


export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");

  React.useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await axios.get("https://xvgkr5-3001.csb.app/api/notes");
      setNotes(response.data);
      setCurrentNoteId(response.data[0] && response.data[0].id);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }

  async function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your notes here",
    };
    try {
      await axios.post("https://xvgkr5-3001.csb.app/api/notes", newNote);
      fetchNotes();
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  }

  async function updateNote(text) {
    try {
      await axios.put(`https://xvgkr5-3001.csb.app/api/notes/${currentNoteId}`, { body: text });
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  async function deleteNote(event, noteId) {
    event.stopPropagation();
    try {
      await axios.delete(`https://xvgkr5-3001.csb.app/api/notes/${noteId}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  function findCurrentNote() {
    return notes.find((note) => {
      return note.id === currentNoteId;
    }) || notes[0];
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
