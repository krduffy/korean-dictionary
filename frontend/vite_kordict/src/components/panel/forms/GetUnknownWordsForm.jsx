import React, { useContext, useEffect, useState } from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import ClipboardCopier from "../string_formatters/ClipboardCopier.jsx";

import "./unknown-word-styles.css";

const GetUnknownWordsForm = () => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const [textContent, setTextContent] = useState("");
    const [unknownWords, setUnknownWords] = useState([]);

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier({
        text: "",
    });

    useEffect(() => {
        updateFormDataField("text", textContent);
    }, [textContent]);

    useEffect(() => {
        if (successful) {
            setUnknownWords(response["unknown"]);
        }
    }, [response]);

    const handleSubmit = () => {
        apiModify(
            "api/user_unknown_words/",
            authInfo["token"],
            formData,
            "POST"
        );
    };

    return (
        <>
            <div className="form-upper-bar">모르는 단어 찾기 도구</div>

            <div className="form-tip">
                상자에 입력어를 넣으시면 모르는 단어를 찾는 도구입니다.
                <div className="form-tip-detail">
                    사전을 처음으로 사용하는 데 본인이 아는 단어가 모르는
                    설정으로 되어 있습니다. 아는 단어가 검색 결과에 우선되고
                    한자 용례로 제공되니 아는 단어가 많을 수록 사전 사용이 더욱
                    유익해집니다.
                </div>
            </div>

            <div className="form-tip">
                이 페이지를 벗어나면 입력어가 저장되지{" "}
                <span style={{ textDecoration: "underline", color: "red" }}>
                    않으니
                </span>{" "}
                주의하세요.
            </div>

            <div className="input-box-and-button-container">
                <textarea
                    className="input-box"
                    onChange={(event) => setTextContent(event.target.value)}
                ></textarea>
                <div className="input-button-container">
                    <button
                        onClick={handleSubmit}
                        className="find-words-button"
                    >
                        분석
                    </button>
                </div>
            </div>

            <div className="lower-information">
                {loading ? (
                    <LoadingMessage />
                ) : error ? (
                    <ErrorMessage errorResponse={response} />
                ) : (
                    unknownWords.length != 0 && (
                        <>
                            <div className="unknown-words-box-header">
                                모르는 단어
                            </div>
                            <div className="unknown-words-box">
                                {unknownWords.map((word, index) => (
                                    <span key={index} className="unknown-word">
                                        {word}
                                        <ClipboardCopier string={word} />
                                    </span>
                                ))}
                            </div>
                        </>
                    )
                )}
            </div>
        </>
    );
};

export default GetUnknownWordsForm;
