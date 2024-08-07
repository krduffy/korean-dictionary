import React, { useContext, useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";
import { useAPIModifier } from "../../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import ErrorMessage from "../../messages/ErrorMessage.jsx";
import HanjaCharacterSpan from "../../string_formatters/HanjaCharacterSpan.jsx";
import PopupBox from "../../string_formatters/PopupBox.jsx";
import StringWithHanja from "../../string_formatters/StringWithHanja.jsx";
import GameExplanationBox from "./GameExplanationBox.jsx";

import "./hanja-game-styles.css";

const SubmitArea = ({
    allowedCharacters,
    words,
    startFrom,
    goTo,
    getNextGame,
}) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const { formData, apiModify, successful, response, error, loading } =
        useAPIModifier(true, {
            /* need to stringify arrays */
            allowed_characters: JSON.stringify(allowedCharacters),
            words: (() => {
                /* have to remove " " in array and combine the characters together */
                const condenseStrs = [];

                words.forEach((charList) => {
                    condenseStrs.push(charList.join("").trim());
                });

                return JSON.stringify(condenseStrs);
            })(),
            start_from: startFrom,
            go_to: goTo,
        });

    const handleSubmit = () => {
        apiModify(
            "api/hanja_game_solution_verifier/",
            authInfo["token"],
            formData,
            "POST"
        );
    };

    return (
        <div className="submit-area">
            {response?.errors ? (
                <ErrorMessage errorResponse={response} />
            ) : response?.verifier_errors ? (
                <WordFeedbackArea postResponse={response} />
            ) : (
                successful && <SuccessArea getNextGame={getNextGame} />
            )}

            <div className="instructions-area">
                <div>
                    출발 자:{" "}
                    <span style={{ cursor: "help" }}>
                        <StringWithHanja string={startFrom} />
                    </span>
                </div>
                <div>⇓</div>{" "}
                <div>
                    도착 자:{" "}
                    <span style={{ cursor: "help" }}>
                        <StringWithHanja string={goTo} />
                    </span>
                </div>
                <br />
                <InstructionQuestionMark startFrom={startFrom} goTo={goTo} />
            </div>
            <div className="submit-button-area">
                <button
                    className="hanja-game-submit-button"
                    onClick={handleSubmit}
                >
                    완료
                </button>
            </div>
        </div>
    );
};

export default SubmitArea;

const InstructionQuestionMark = ({ startFrom, goTo }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const questionMarkRef = useRef(null);

    const renderInstructions = () => {
        const dim = getElementSizing(questionMarkRef);
        return (
            <GameExplanationBox
                fromX={dim.centerX}
                fromY={dim.centerY}
                popupPadding={dim.paddingX + 10}
            />
        );
    };

    return (
        <>
            <span
                className="instruction-question-mark"
                ref={questionMarkRef}
                onMouseEnter={() => {
                    setShowInstructions(true);
                }}
                onMouseLeave={() => setShowInstructions(false)}
            >
                ?
            </span>
            {showInstructions && renderInstructions()}
        </>
    );
};

const SuccessArea = ({ getNextGame }) => {
    return (
        <div
            className="textcentered lrpad-10 space-children-vertical"
            style={{
                gridRow: "1 / 5",
                gridColumn: "1 / 2",
                paddingTop: "20px",
                paddingBottom: "20px",
            }}
        >
            <div
                className="full-width textcentered"
                style={{
                    color: "var(--gold)",
                    fontSize: "24px",
                }}
            >
                성공!
            </div>
            <div className="center-children-horizontal pad-10">
                <button
                    className="full-width"
                    onClick={() => {
                        getNextGame();
                    }}
                >
                    다른 게임 풀어보기
                </button>
            </div>
        </div>
    );
};

const WordFeedbackArea = ({ postResponse }) => {
    return (
        <div className="word-feedback-area">
            {postResponse["verifier_errors"].map((errorList, id) => (
                <div
                    key={id}
                    style={{
                        gridRow: `${id + 1} / ${id + 2}`,
                        gridColumn: "1 / 2",
                    }}
                >
                    <IndividualWordFeedbackArea errorList={errorList} />
                </div>
            ))}
        </div>
    );
};

const IndividualWordFeedbackArea = ({ errorList }) => {
    const [showInfo, setShowInfo] = useState(false);
    const symbolRef = useRef(null);

    const renderMessages = () => {
        const dim = getElementSizing(symbolRef);

        return (
            <PopupBox
                padding={dim.paddingX + 10}
                positioning="fit"
                fromX={dim.centerX}
                fromY={dim.centerY}
            >
                {errorList.length > 0 ? (
                    errorList.map((error, id) => <div key={id}>{error}</div>)
                ) : (
                    <div>이 줄은 괜찮습니다.</div>
                )}
            </PopupBox>
        );
    };

    return (
        <>
            <span
                className="hanja-word-feedback-warning"
                ref={symbolRef}
                onMouseEnter={() => {
                    setShowInfo(true);
                }}
                onMouseLeave={() => {
                    setShowInfo(false);
                }}
                style={{
                    backgroundColor: errorList.length > 0 ? "red" : "green",
                    cursor: "help",
                }}
            >
                {errorList.length > 0 ? "⚠" : "☑"}
            </span>

            {showInfo && renderMessages()}
        </>
    );
};
