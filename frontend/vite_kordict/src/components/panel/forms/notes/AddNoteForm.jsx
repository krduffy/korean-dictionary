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
        <div className="curved-box-nest1">
            <div className="curved-box-header">새로운 노트 추가</div>

            <form encType="multipart/form-data">
                <div
                    className="full-width"
                    style={{
                        display: "grid",
                        padding: "20px",
                        rowGap: "20px",
                    }}
                >
                    <div
                        className=""
                        style={{
                            gridRow: "1 / 2",
                            gridColumn: "1 / 2",
                        }}
                    >
                        이미지 (필수){" "}
                        <span style={{ fontSize: "12px" }}>
                            .png, .jpg, .gif 지원
                        </span>
                    </div>
                    <div
                        style={{
                            gridRow: "1 / 2",
                            gridColumn: "2 / 3",
                        }}
                    >
                        <FileUpload
                            updateFormDataField={updateFormDataField}
                            fieldToUpdate={"note_image"}
                        />
                    </div>

                    <div
                        style={{
                            gridRow: "2 / 3",
                            gridColumn: "1 / 2",
                        }}
                    >
                        글 (선택)
                    </div>
                    <textarea
                        className="note-text-area"
                        value={formData.note_text}
                        style={{
                            gridRow: "2 / 3",
                            gridColumn: "2 / 3",
                        }}
                        onChange={(event) => {
                            updateFormDataField(
                                "note_text",
                                event.target.value
                            );
                        }}
                    ></textarea>
                    <div
                        className="full-width tbmargin-10 center-children-horizontal"
                        style={{
                            gridRow: "3 / 4",
                            gridColumn: "1 / 3",
                        }}
                    >
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className="add-example-submit-button"
                        >
                            추가
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddNoteForm;
