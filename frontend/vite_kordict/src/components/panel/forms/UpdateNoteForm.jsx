import React, { useContext, useRef } from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

import "./form-styles.css";

const UpdateNoteForm = ({ wordTargetCode, numInitiallyExistingNotes }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const selectedFileTextRef = useRef(null);

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

                <div>
                    <label id="file-input-button" htmlFor="file-input">
                        파일 찾아보기
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        accept=".jpg,.png,.gif"
                        onChange={(event) => {
                            selectedFileTextRef.current.innerText =
                                event.target.files[0].name;
                            updateFormDataField(
                                "note_image",
                                event.target.files[0]
                            );
                        }}
                    ></input>
                    <span ref={selectedFileTextRef} id="selected-file-span">
                        선택한 파일이 없습니다.
                    </span>
                </div>

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
