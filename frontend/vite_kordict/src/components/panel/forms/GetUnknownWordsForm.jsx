import React, { useContext, useEffect, useRef, useState } from "react";

import {
    getBasicSearchKoreanView,
    getBasicUnknownWordsView,
} from "../../../../util/viewUtils.js";
import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import PanelSpecificClickableText from "../string_formatters/PanelSpecificClickableText.jsx";
import TruncatorDropdown from "../string_formatters/TruncatorDropdown.jsx";

import "./unknown-word-styles.css";

const GetUnknownWordsForm = ({
    initialTextContent,
    initialUnknownWords,
    alreadyInteracted,
}) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const [textContent, setTextContent] = useState(initialTextContent);
    const [unknownWords, setUnknownWords] = useState(initialUnknownWords);
    const [interacted, setInteracted] = useState(alreadyInteracted);

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier(true, {
        text: initialTextContent,
    });

    const updateCurrentViewInHistory =
        useContext(ViewContext)["updateCurrentViewInHistory"];

    const updateHistory = () => {
        const basicView = getBasicUnknownWordsView();

        const newView = {
            view: basicView.view,
            value: {
                initialTextContent: textContent,
                initialUnknownWords: unknownWords,
                alreadyInteracted: interacted,
            },
            searchBarInitialState: { ...basicView.searchBarInitialState },
        };

        console.log(newView);

        updateCurrentViewInHistory(newView);
    };

    useEffect(() => {
        updateFormDataField("text", textContent);
    }, [textContent]);

    useEffect(() => {
        updateHistory();
    }, [interacted, JSON.stringify(unknownWords)]);

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
            <div
                className="curved-box textcentered pad-10"
                style={{
                    fontSize: "30px",
                    marginBottom: "10px",
                    backgroundColor: "var(--deepred)",
                }}
            >
                모르는 단어 찾기 도구
            </div>

            <FormTips />

            <SubmitArea
                textContent={textContent}
                setTextContent={setTextContent}
                loading={loading}
                setInteracted={setInteracted}
                handleSubmit={handleSubmit}
            />

            {(interacted || unknownWords.length > 0) && (
                <div
                    className="lower-information"
                    style={{
                        marginTop: "20px",
                    }}
                >
                    {loading ? (
                        <LoadingMessage />
                    ) : error ? (
                        <ErrorMessage errorResponse={response} />
                    ) : (
                        <UnknownWordsSection unknownWords={unknownWords} />
                    )}
                </div>
            )}
        </>
    );
};

export default GetUnknownWordsForm;

const FormTips = () => {
    const ref = useRef(null);

    return (
        <TruncatorDropdown onCollapseScrollToRef={ref}>
            <div>
                <div ref={ref} className="form-tip">
                    상자에 있는 입력어를 넣으시면 모르는 단어를 찾는 도구입니다.
                    <div className="form-tip-detail">
                        분석 버튼을 누르신 다음에 찾아드립니다. 나오는 단어를
                        클릭하시면 한국어 사전에 검색됩니다.
                    </div>
                    <div className="form-tip-detail">
                        틀릴 수는 있으니 주의하세요.
                    </div>
                </div>
                <div className="form-tip">
                    이 페이지를 벗어나셔도 입력어와 결과가 저장되니 걱정하지
                    않으셔도 됩니다.
                </div>
            </div>
        </TruncatorDropdown>
    );
};

const SubmitArea = ({
    textContent,
    setTextContent,
    loading,
    setInteracted,
    handleSubmit,
}) => {
    return (
        <div className="input-box-and-button-container">
            <textarea
                className="input-box"
                value={textContent}
                onChange={(event) => setTextContent(event.target.value)}
            />

            <div className="input-button-container">
                <button
                    onClick={() => {
                        if (!loading) {
                            setInteracted(true);
                            handleSubmit();
                        }
                    }}
                    style={{ cursor: loading ? "not-allowed" : "pointer" }}
                    className="find-words-button"
                >
                    분석
                </button>
            </div>
        </div>
    );
};

const UnknownWordsSection = ({ unknownWords }) => {
    return (
        <>
            <div
                className="full-width center-children-horizontal"
                style={{
                    marginBottom: "20px",
                }}
            >
                <span
                    className="curved-box-shape"
                    style={{
                        fontSize: "20px",
                        backgroundColor: "var(--deepred)",
                        borderColor: "white",
                        padding: "5px",
                    }}
                >
                    ─ 모르는 단어 ─
                </span>
            </div>
            {unknownWords.length > 0 ? (
                <div className="unknown-words-box">
                    {unknownWords.map((word, index) => (
                        <span key={index} className="unknown-word">
                            <PanelSpecificClickableText
                                text={word}
                                viewOnPush={getBasicSearchKoreanView(word)}
                            />
                        </span>
                    ))}
                </div>
            ) : (
                <div className="full-width textcentered">
                    모르는 단어가 없습니다.
                </div>
            )}
        </>
    );
};
