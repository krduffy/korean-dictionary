import React, { useContext, useRef } from "react";

import { BASE_URL } from "../../../constants.js";
import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import FileUpload from "./form_components/FileUpload.jsx";

const EditNoteForm = ({ noteData, num }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        apiModify(
            `api/update_note/${noteData.id}`,
            authInfo["token"],
            formData,
            "PATCH"
        );
    };

    return (
        <div style={{ width: "100%" }}>
            <div>노트 {num}</div>
            <form encType="multipart/form-data">
                <div style={{ width: "75%", padding: "5px" }}>
                    {noteData?.note_image ? (
                        <img
                            style={{ width: "50%" }}
                            src={BASE_URL + noteData.note_image}
                        />
                    ) : (
                        <div> 이 노트는 사진이 없습니다.</div>
                    )}
                    <span>새로운 사진 놓기</span>
                    <FileUpload
                        updateFormDataField={updateFormDataField}
                        fieldToUpdate={"note_image"}
                        uniqueId={`editnote${num}`}
                    />
                </div>

                <div style={{ width: "25%", padding: "5px" }}>
                    <textarea
                        className="note-text-area"
                        value={formData.note_text}
                        onChange={(event) => {
                            updateFormDataField(
                                "note_text",
                                event.target.value
                            );
                        }}
                    ></textarea>

                    <button
                        onClick={(e) => handleSubmit(e)}
                        className="add-example-submit-button"
                    >
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditNoteForm;
