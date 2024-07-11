import React, { useContext } from "react";

import PropTypes from "prop-types";

import { BASE_URL } from "../../../constants.js";

import { ViewContext } from "../Panel.jsx";

/**
 * A component for rendering a user note as a boxed note in a grid of notes.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.noteData - The note data map containing `note_image` and `note_text` keys.
 * @returns {React.JSX.Element} The rendered UserNote component.
 */
export const UserNote = ({ noteData, disableClick, nestLevel }) => {
    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    return (
        <div
            className={
                nestLevel
                    ? `curved-box-nest${nestLevel} pad-10 textcentered`
                    : "curved-box pad-10 textcentered"
            }
            onClick={() => {
                if (!disableClick) {
                    updateViewAndPushToHistory({
                        view: "detail_note",
                        value: noteData,
                        searchBarInitialState: {
                            boxContent: "",
                            dictionary: "korean",
                        },
                    });
                }
            }}
        >
            <img
                className="full-width"
                src={BASE_URL + noteData["note_image"]}
            ></img>
            <div className="tbmargin-10">{noteData.note_text}</div>
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
                <UserNote key={id} noteData={data} disableClick={false} />
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
