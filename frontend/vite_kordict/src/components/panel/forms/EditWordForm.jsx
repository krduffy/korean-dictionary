import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";

import "./form-styles.css";

const EditWordForm = ({ targetCode }) => {
    const [wordData, setWordData] = useState({});
    const { apiFetch, loading, error } = useAPIFetcher();

    useEffect(() => {
        apiFetch(
            `http://127.0.0.1:8000/api/korean_word/${targetCode}`,
            setWordData
        );
    }, [targetCode]);

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

                    <AddExampleForm wordTargetCode={targetCode} />
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

const AddExampleForm = ({ wordTargetCode, alreadyAtLeastOneExample }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const [showForm, setShowForm] = useState(false);

    const [exampleText, setExampleText] = useState("");
    const [sourceText, setSourceText] = useState("");

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier({
        referent: wordTargetCode,
        definition: "정의", // will not be rendered in sense view component because order is 0
        additional_info: {
            example_info: [
                {
                    source: "",
                    example: "",
                },
            ],
        },
        order: 0,
    });

    const updateExampleInfo = (field, value) => {
        const newFormData = { ...formData };
        const newExampleInfo = [...newFormData.additional_info.example_info];
        newExampleInfo[0] = { ...newExampleInfo[0], [field]: value };
        newFormData.additional_info.example_info = newExampleInfo;
        updateFormDataField("additional_info", newFormData.additional_info);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        apiModify(
            "http://127.0.0.1:8000/api/create_sense/",
            authInfo["token"],
            formData,
            "POST"
        );
    };

    return (
        <div className="add-example-form">
            <div className="add-example-form-upper-bar">
                <div className="add-example-header">예문 추가</div>
            </div>

            <div className="text-area-container">
                <dl>
                    <dt className="text-area-container-dt">예문 (필수)</dt>
                    <dd className="text-area-container-dd">
                        <textarea
                            className="add-example-text-area"
                            value={
                                formData["additional_info"]["example_info"][0][
                                    "example"
                                ]
                            }
                            onChange={(event) =>
                                updateExampleInfo("example", event.target.value)
                            }
                        ></textarea>
                    </dd>
                </dl>
                <dl>
                    <dt className="text-area-container-dt">출처 (선택)</dt>
                    <dd className="text-area-container-dd">
                        <textarea
                            className="add-example-text-area"
                            value={
                                formData["additional_info"]["example_info"][0][
                                    "source"
                                ]
                            }
                            onChange={(event) =>
                                updateExampleInfo("source", event.target.value)
                            }
                        ></textarea>
                    </dd>
                </dl>
            </div>

            <div className="add-example-form-lower-bar">
                <div className="add-example-tip">
                    예문 입력 시 중활고에 담는 단어 아래에 밑줄을 그려줍니다.
                </div>
                <button
                    onClick={(e) => handleSubmit(e)}
                    className="add-example-submit-button"
                >
                    추가
                </button>
            </div>
        </div>
    );
};
