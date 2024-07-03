import React, { useState } from "react";

import AddNoteForm from "./AddNoteForm.jsx";
import EditNoteForm from "./EditNoteForm.jsx";

const EditNotesForm = ({ wordTargetCode, initiallyExistingNotes }) => {
    const [notes, setNotes] = useState(initiallyExistingNotes);

    const deleteNoteById = (id) => {
        console.log(id);
        console.log(notes);
        const newNotes = notes.filter((noteData) => noteData.id != id);
        setNotes(newNotes);
    };

    const updateNoteById = (id, noteData) => {
        const newNotes = [...notes];
        const i = newNotes.findIndex((noteData) => noteData.id === id);
        newNotes[i] = noteData;
        setNotes(newNotes);
    };

    const appendNote = (noteData) => {
        const newNotes = [...notes];
        newNotes.push(noteData);
        setNotes(newNotes);
    };

    return (
        <div>
            <>
                <div className="section-header">노트 수정</div>
                {notes?.length > 0 ? (
                    notes.map((noteData, id) => (
                        <EditNoteForm
                            key={id}
                            noteData={noteData}
                            num={id + 1}
                            updateNoteById={updateNoteById}
                            deleteNoteById={deleteNoteById}
                        />
                    ))
                ) : (
                    <div>노트가 없습니다.</div>
                )}
                {notes && (
                    <AddNoteForm
                        wordTargetCode={wordTargetCode}
                        initiallyExistingNotes={notes}
                        appendNote={appendNote}
                    />
                )}
            </>
        </div>
    );
};

export default EditNotesForm;
