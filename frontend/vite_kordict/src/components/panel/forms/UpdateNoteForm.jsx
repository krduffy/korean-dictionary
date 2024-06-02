import React, { useContext, useEffect, useState } from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

import "./form-styles.css";

const UpdateNoteForm = ({ wordTargetCode, numInitiallyExistingNotes }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const {
        formData,
        updateFormDataField,
        initFormFromDict,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier(true, {
        word_ref: wordTargetCode,
        order: numInitiallyExistingNotes,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        apiModify("api/create_note/", authInfo["token"], formData, "POST");
    };

    return (
        <React.Fragment>
            <div className="add-example-form">
                <div className="form-upper-bar">
                    <span className="add-example-header">예문 추가하기</span>
                </div>
            </div>

            <form encType="multipart/form-data">
                <textarea
                    className="note-text-area"
                    value={formData.note_text}
                    onChange={(event) => {
                        updateFormDataField("note_text", event.target.value);
                    }}
                ></textarea>

                <input
                    type="file"
                    accept=".jpg,.png,.gif"
                    onChange={(event) => {
                        updateFormDataField(
                            "note_image",
                            event.target.files[0]
                        );
                        console.log(event.target.files[0]);
                    }}
                ></input>

                <button
                    onClick={(e) => handleSubmit(e)}
                    className="add-example-submit-button"
                >
                    노트 추가
                </button>
            </form>
        </React.Fragment>
    );
};

export default UpdateNoteForm;
