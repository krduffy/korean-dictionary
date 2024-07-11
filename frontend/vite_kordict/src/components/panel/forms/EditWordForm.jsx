import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import AddExampleForm from "./AddExampleForm.jsx";
import EditNotesForm from "./notes/EditNotesForm.jsx";

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
                        <span
                            style={{
                                fontSize: "40px",
                            }}
                        >
                            {wordData["word"]}
                        </span>
                    )}

                    {wordData["example_info"] && (
                        <div className="tbmargin-10">
                            <AddExampleForm
                                wordTargetCode={targetCode}
                                senseTargetCode={
                                    wordData.example_info["target_code"]
                                }
                                initiallyExistingExamples={
                                    wordData.example_info["examples"]
                                }
                            />
                        </div>
                    )}

                    {wordData.notes && (
                        <div className="tbmargin-10">
                            <EditNotesForm
                                wordTargetCode={targetCode}
                                initiallyExistingNotes={wordData["notes"]}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default EditWordForm;
