import { ViewContext } from "../Panel";

import React, { useContext } from "react";

import PropTypes from "prop-types";

const BASE_URL = "http://127.0.0.1:8000";

/**
 * A component for rendering a user note as a boxed note in a grid of notes.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.noteData - The note data map containing `note_image` and `note_text` keys.
 * @returns {React.JSX.Element} The rendered UserNote component.
 */
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

UserNote.propTypes = {
    noteData: PropTypes.shape({
        note_image: PropTypes.string.isRequired,
        note_text: PropTypes.string.isRequired,
    }).isRequired,
};

/**
 * A component for rendering a list of clickable notes with images and descriptions.
 * @param {Object} props - Component props.
 * @param {Object} props.noteData - An array of objects that contain keys for note display [`note_image` and `note_text`].
 * @returns The rendered note grid.
 */
export const UserNoteGrid = ({ noteData }) => {
    return (
        <div className="user-note-grid">
            {noteData.map((data, id) => (
                <UserNote key={id} noteData={data} />
            ))}
        </div>
    );
};

UserNoteGrid.propTypes = {
    noteData: PropTypes.arrayOf(
        PropTypes.shape({
            note_image: PropTypes.string.isRequired,
            note_text: PropTypes.string.isRequired,
        })
    ).isRequired,
};

/**
 * A component for rendering a user note in detail to the entire view window.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.noteData - The note data map containing `note_image` and `note_text` keys.
 * @returns {React.JSX.Element} The rendered UserNoteDetail component.
 */
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

UserNoteDetail.propTypes = {
    noteData: PropTypes.shape({
        note_image: PropTypes.string.isRequired,
        note_text: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserNote;
