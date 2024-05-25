import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import AddExampleForm from "./AddExampleForm.jsx";

import "./form-styles.css";

const EditWordForm = ({ targetCode }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const [wordData, setWordData] = useState({});
    const { apiFetch, loading, error } = useAPIFetcher();
    const [initiallyExistingExamples, setInitiallyExistingExamples] = useState(
        []
    );

    useEffect(() => {
        apiFetch(
            `http://127.0.0.1:8000/api/korean_word/${targetCode}`,
            authInfo["token"],
            setWordData
        );
    }, [targetCode]);

    useEffect(() => {
        if (
            wordData &&
            wordData["senses"] &&
            wordData["senses"][0] &&
            wordData["senses"][0]["additional_info"] &&
            wordData["senses"][0]["additional_info"]["example_info"] &&
            wordData["senses"][0]["additional_info"]["example_info"]
        ) {
            console.log("in");
            setInitiallyExistingExamples(
                wordData["senses"][0]["additional_info"]["example_info"]
            );
        }
    }, [wordData]);

    return (
        <>
            {loading ? (
                <LoadingMessage />
            ) : (
                <div className="korean-word-view">
                    <span className="word-header">
                        <span>{wordData["word"]}</span>
                        {"  [수정]"}
                    </span>

                    <AddExampleForm
                        wordTargetCode={targetCode}
                        initiallyExistingExamples={initiallyExistingExamples}
                    />
                    {/*
          <div className="senses-container">
            {formData["senses"] &&
              formData["senses"].map((data) => (
                <KoreanSenseView key={data["target_code"]} senseData={data} />
              ))}
          </div>
            */}
                </div>
            )}
        </>
    );
};

export default EditWordForm;
