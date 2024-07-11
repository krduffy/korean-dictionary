import React, { useState } from "react";

import AddNoteForm from "./AddNoteForm.jsx";
import EditNoteForm from "./EditNoteForm.jsx";

import "../form-styles.css";

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
        <div className="curved-box">
            <div className="curved-box-header">노트 수정</div>

            <div className="pad-10">
                <div className="form-tip">
                    노트는 따로 저장됩니다. 2개 이상의 노트를 추가하시면
                    노트마다 저장 버튼을 클릭하시길 바랍니다.
                </div>
                <div className="form-tip">
                    노트를 삭제하신 후 복구할 수는{" "}
                    <span style={{ color: "red" }}>없습니다.</span>
                </div>
                <br /> <div className="horizontal-bar" /> <br />
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
                    <div className="word-emphasized-box textcentered">
                        노트가 없습니다.
                    </div>
                )}
                {notes && (
                    <AddNoteForm
                        wordTargetCode={wordTargetCode}
                        initiallyExistingNotes={notes}
                        appendNote={appendNote}
                    />
                )}
            </div>
        </div>
    );
};

export default EditNotesForm;
