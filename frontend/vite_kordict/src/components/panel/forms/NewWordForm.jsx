import React, { useContext } from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";

import "./form-styles.css";

const NewWordForm = () => {
    const viewContext = useContext(ViewContext);
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        error,
        response,
    } = useAPIModifier({
        word: "",
        origin: "",
        // default is 어휘 for the <select> tag
        word_type: "어휘",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        apiModify("api/create_word/", authInfo["token"], formData, "POST");
    };

    return (
        <div className="add-word-form-container">
            <div className="form-title">새 단어 추가</div>
            <form onSubmit={handleSubmit} className="add-word-form">
                <div>
                    <label htmlFor="word">단어 (필수)</label>
                    <input
                        className="add-word-input-box"
                        type="text"
                        name="word"
                        onChange={(e) => {
                            updateFormDataField("word", e.target.value);
                        }}
                    ></input>
                </div>

                <div>
                    <label htmlFor="origin">어원 (선택)</label>
                    <input
                        className="add-word-input-box"
                        type="text"
                        name="origin"
                        onChange={(e) => {
                            updateFormDataField("origin", e.target.value);
                        }}
                    ></input>
                </div>

                <div>
                    <label htmlFor="word_type">어류 (필수)</label>
                    <select
                        type="text"
                        name="word_type"
                        onChange={(e) => {
                            updateFormDataField("word_type", e.target.value);
                        }}
                    >
                        {/* check for all of the options that are possible */}
                        <option value="어휘">어휘</option>
                        <option value="속담">속담</option>
                    </select>
                </div>

                <button type="submit">추가</button>
            </form>
            <div>
                {successful && (
                    <div>
                        <span>추가되었습니다.</span>
                        <button
                            onClick={() => {
                                updateViewAndPushToHistory({
                                    view: "detail_korean",
                                    value: response["target_code"],
                                    searchBarInitialState: {
                                        boxContent: response["word"],
                                        dictionary: "korean",
                                    },
                                });
                            }}
                        >
                            추가한 단어로 바로가기
                        </button>
                    </div>
                )}
                {error && <ErrorMessage errorResponse={response} />}
            </div>
        </div>
    );
};

export default NewWordForm;
