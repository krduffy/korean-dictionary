import React, { useContext, useEffect } from "react";

import { useAPIModifier } from "../../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import FileUpload from "../form_components/FileUpload.jsx";

import "../form-styles.css";

const AddNoteForm = ({
    wordTargetCode,
    initiallyExistingNotes,
    appendNote,
}) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier(true, {
        word_ref: wordTargetCode,
        order: initiallyExistingNotes.length,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        apiModify("api/create_note/", authInfo["token"], formData, "POST");
    };

    useEffect(() => {
        if (successful) {
            appendNote(response);
        }
    }, [successful]);

    return (
        <React.Fragment>
            <form encType="multipart/form-data">
                <textarea
                    className="note-text-area"
                    value={formData.note_text}
                    onChange={(event) => {
                        updateFormDataField("note_text", event.target.value);
                    }}
                ></textarea>

                <div>
                    <FileUpload
                        updateFormDataField={updateFormDataField}
                        fieldToUpdate={"note_image"}
                    />
                </div>

                <button
                    onClick={(e) => handleSubmit(e)}
                    className="add-example-submit-button"
                >
                    추가
                </button>
            </form>
        </React.Fragment>
    );
};

export default AddNoteForm;
