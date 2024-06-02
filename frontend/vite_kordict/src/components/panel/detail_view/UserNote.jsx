import React from "react";

const UserNote = ({ noteData }) => {
    const BASE_URL = "http://127.0.0.1:8000";

    return (
        <div className="user-note-container">
            <div className="user-note-text">{noteData.note_text}</div>
            <img
                className="user-note-image-container"
                src={BASE_URL + noteData["note_image"]}
            ></img>
        </div>
    );
};

export default UserNote;
