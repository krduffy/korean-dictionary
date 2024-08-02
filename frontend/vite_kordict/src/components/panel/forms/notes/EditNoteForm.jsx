import React, { useContext, useEffect, useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";
import {
    getPanelCenterX,
    getPanelCenterY,
} from "../../../../../util/mathUtils.js";
import { useAPIModifier } from "../../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import UserNote from "../../detail_view/UserNote.jsx";
import ErrorMessage from "../../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import PopupBox from "../../string_formatters/PopupBox.jsx";
import FileUpload from "../form_components/FileUpload.jsx";

const MESSAGE_BUFFER_TIME = 3500;

const EditNoteForm = ({ noteData, num, updateNodeById, deleteNoteById }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const updateButtonRef = useRef(null);

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier(true, {
        /* if "" is sent then it is not picked up in the form data, maybe due to being multipart.
           to get around this " " is sent. when notes are rendered, they will not be different
           from having null note_text vs having " " because both values are falsy */
        note_text: " ",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        apiModify(
            `api/update_note/${noteData.id}`,
            authInfo["token"],
            formData,
            "PATCH"
        );
    };

    /* Currently this is not executed because updating a note causes cache invalidation anyway
    useEffect(() => {
      if (successful) {
        updateNodeById()
      }
    }, [successful]);
    */

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
                        <button
                            ref={updateButtonRef}
                            onClick={(e) => handleSubmit(e)}
                        >
                            저장
                        </button>
                    </div>
                </div>
            </form>

            <APIMessager
                relativeToRef={updateButtonRef}
                loading={loading}
                successful={successful}
                error={error}
                response={response}
                printWhenSuccessful={"저장이 성공했습니다."}
            />
        </div>
    );
};

export default EditNoteForm;

const DeleteNoteForm = ({ deleteNoteById, noteId }) => {
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

    const deleteButtonRef = useRef(null);

    useEffect(() => {
        if (successful) {
            setTimeout(() => deleteNoteById(noteId), MESSAGE_BUFFER_TIME);
        }
    }, [successful]);

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
            <APIMessager
                relativeToRef={deleteButtonRef}
                loading={loading}
                successful={successful}
                error={error}
                response={response}
                printWhenSuccessful={"삭제가 성공했습니다."}
            />
        </div>
    );
};

const APIMessager = ({
    relativeToRef,
    loading,
    successful,
    error,
    response,
    printWhenSuccessful,
}) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (loading || successful || error) {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), MESSAGE_BUFFER_TIME);
        }
    }, [loading, successful, error]);

    useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                setShowMessage(false);
            }, MESSAGE_BUFFER_TIME);
        }
    }, [showMessage]);

    return showMessage ? (
        <PopupBox
            fromX={(() => {
                const dim = getElementSizing(relativeToRef);
                const x = dim.centerX - dim.paddingX;
                return getPanelCenterX(x);
            })()}
            fromY={getPanelCenterY()}
            positioning="center-around"
            padding={0}
        >
            {loading ? (
                <LoadingMessage />
            ) : error ? (
                <ErrorMessage errorResponse={response} />
            ) : (
                successful && (
                    <div
                        style={{
                            color: "green",
                            fontSize: "30px",
                        }}
                    >
                        {printWhenSuccessful}
                    </div>
                )
            )}
        </PopupBox>
    ) : (
        <></>
    );
};
