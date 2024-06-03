import React from "react";

const UserNote = ({ noteData }) => {
    const BASE_URL = "http://127.0.0.1:8000";

    return (
        <div className="user-note-container">
            <img
                className="user-note-image"
                src={BASE_URL + noteData["note_image"]}
            ></img>
            <div className="user-note-text">{noteData.note_text}</div>
        </div>
    );
};

export const UserNoteGrid = ({ noteData }) => {
    return (
        <div className="user-note-grid">
            {noteData.map((data, id) => (
                <UserNote key={id} noteData={data} />
            ))}
        </div>
    );
};

export default UserNote;
