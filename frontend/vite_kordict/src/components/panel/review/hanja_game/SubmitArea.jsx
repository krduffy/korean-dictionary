import React, { useContext, useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";
import { useAPIModifier } from "../../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import ErrorMessage from "../../messages/ErrorMessage.jsx";
import PopupBox from "../../string_formatters/PopupBox.jsx";
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

                const withoutBlanks = condenseStrs.filter(
                    (word) => word.length > 0
                );

                return JSON.stringify(withoutBlanks);
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
                <InstructionQuestionMark startFrom={startFrom} goTo={goTo} />
            </div>
            <div className="submit-button-area">
                <button onClick={handleSubmit}>완료</button>
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
        return <GameExplanationBox fromX={dim.centerX} fromY={dim.centerY} />;
    };

    return (
        <>
            <span
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
        <div>
            성공!
            <button
                onClick={() => {
                    getNextGame();
                }}
            >
                다른 게임 하기
            </button>
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
                padding={5}
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
                }}
            >
                {errorList.length > 0 ? "⚠" : "☑"}
            </span>

            {showInfo && renderMessages()}
        </>
    );
};
