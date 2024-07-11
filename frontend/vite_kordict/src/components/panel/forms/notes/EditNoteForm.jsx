import React, { useContext, useEffect, useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";
import {
    getPanelCenterX,
    getPanelCenterY,
} from "../../../../../util/mathUtils.js";
import { BASE_URL } from "../../../../constants.js";
import { useAPIModifier } from "../../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import UserNote from "../../detail_view/UserNote.jsx";
import ErrorMessage from "../../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import PopupBox from "../../string_formatters/PopupBox.jsx";
import FileUpload from "../form_components/FileUpload.jsx";

const EditNoteForm = ({ noteData, num, updateNodeById, deleteNoteById }) => {
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
        <div className="full-width curved-box-nest1">
            <div className="curved-box-header space-children-horizontal">
                <div>노트 {num}</div>
                <DeleteNoteForm
                    deleteNoteById={deleteNoteById}
                    noteId={noteData.id}
                />
            </div>

            <form encType="multipart/form-data" className="pad-10">
                <div style={{ display: "inline-block", maxWidth: "50%" }}>
                    <UserNote
                        noteData={noteData}
                        disableClick={true}
                        nestLevel={2}
                    />
                </div>

                <div style={{ display: "inline-block", maxWidth: "50%" }}>
                    <div className="pad-10">
                        <div className="pad-10">다른 이미지로 바꾸기:</div>
                        <div style={{ textAlign: "right" }}>
                            <FileUpload
                                updateFormDataField={updateFormDataField}
                                fieldToUpdate={"note_image"}
                            />
                        </div>
                    </div>

                    <div className="pad-10">
                        <div className="pad-10">새로운 글을 붙이기:</div>
                        <div>
                            <textarea
                                value={formData.note_text}
                                className="full-width"
                                onChange={(event) => {
                                    updateFormDataField(
                                        "note_text",
                                        event.target.value
                                    );
                                }}
                            ></textarea>
                        </div>
                    </div>

                    <div className="full-width pad-10 tbmargin-10 center-children-horizontal">
                        <button onClick={(e) => handleSubmit(e)}>저장</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditNoteForm;

const DeleteNoteForm = ({ deleteNoteById, noteId }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiModify, successful, response, error } = useAPIModifier(true);

    const deleteButtonRef = useRef(null);

    const [showMessage, setShowMessage] = useState(false);

    const DELETE_BUFFER_TIME = 3500;

    useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                setShowMessage(false);
            }, DELETE_BUFFER_TIME);
        }
    }, [showMessage]);

    useEffect(() => {
        if (successful || error) {
            setShowMessage(true);

            if (successful) {
                setTimeout(() => deleteNoteById(noteId), DELETE_BUFFER_TIME);
            }
        }
    }, [successful, error]);

    return (
        <div>
            <div
                ref={deleteButtonRef}
                className="curved-box-shape item-delete-button textcentered pad-10 pointer"
                onClick={() => {
                    const deleteUrl = `api/delete_note/${noteId}`;

                    apiModify(deleteUrl, authInfo["token"], {}, "DELETE");
                }}
            >
                노트 삭제
            </div>

            {showMessage && (
                <PopupBox
                    fromX={(() => {
                        const dim = getElementSizing(deleteButtonRef);
                        const x = dim.centerX - dim.paddingX;
                        return getPanelCenterX(x);
                    })()}
                    fromY={getPanelCenterY()}
                    positioning="center-around"
                    padding={0}
                >
                    {error ? (
                        <ErrorMessage errorResponse={response} />
                    ) : (
                        successful && (
                            <div
                                style={{
                                    color: "green",
                                    fontSize: "30px",
                                }}
                            >
                                삭제 성공
                            </div>
                        )
                    )}
                </PopupBox>
            )}
        </div>
    );
};
