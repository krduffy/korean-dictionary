import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import AddExampleForm from "./AddExampleForm.jsx";
import AddNoteForm from "./AddNoteForm.jsx";
import EditNoteForm from "./EditNoteForm.jsx";
import EditNotesForm from "./EditNotesForm.jsx";

import "./form-styles.css";

const EditWordForm = ({ targetCode }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const [wordData, setWordData] = useState({});
    const { apiFetch, loading, error } = useAPIFetcher();

    useEffect(() => {
        const setData = async () => {
            const data = await apiFetch(
                `api/korean_word_edit_info/${targetCode}`,
                authInfo["token"]
            );
            setWordData(data);
        };

        setData();
    }, [targetCode]);

    return (
        <>
            {loading ? (
                <LoadingMessage />
            ) : (
                <div className="korean-word-view">
                    {wordData["word"] && (
                        <span className="word-header">
                            <span>{wordData["word"]}</span>
                        </span>
                    )}

                    {wordData["example_info"] && (
                        <AddExampleForm
                            wordTargetCode={targetCode}
                            senseTargetCode={
                                wordData.example_info["target_code"]
                            }
                            initiallyExistingExamples={
                                wordData.example_info["examples"]
                            }
                        />
                    )}

                    {wordData.notes && (
                        <EditNotesForm
                            wordTargetCode={targetCode}
                            initiallyExistingNotes={wordData["notes"]}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default EditWordForm;
