import { ViewContext } from "../Panel";

import React, { useContext } from "react";

const BASE_URL = "http://127.0.0.1:8000";

const UserNote = ({ noteData }) => {
    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    return (
        <div
            className="user-note-container"
            onClick={() => {
                updateViewAndPushToHistory({
                    view: "detail_note",
                    value: noteData,
                    searchBarInitialState: {
                        boxContent: "",
                        dictionary: "korean",
                    },
                });
            }}
        >
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

export const UserNoteDetail = ({ noteData }) => {
    return (
        <div className="user-note-detail">
            <img
                className="user-note-image-detail"
                src={BASE_URL + noteData["note_image"]}
            ></img>
            <div className="user-note-text-detail">{noteData.note_text}</div>
        </div>
    );
};

export default UserNote;
