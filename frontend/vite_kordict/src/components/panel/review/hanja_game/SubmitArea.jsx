import React, { useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";
import { useAPIModifier } from "../../../../hooks/useAPIModifier.js";

import GameExplanationBox from "./GameExplanationBox.jsx";

import "./hanja-game-styles.css";

const SubmitArea = ({ allowedCharacters, words, startFrom, goTo }) => {
    const { apiModify, successful, response, error, loading } = useAPIModifier(
        true,
        {
            allowed_characters: allowedCharacters,
            words: words,
            start_from: startFrom,
            go_to: goTo,
        }
    );

    const handleSubmit = () => {
        apiModify("api/hanja_game_solution_verifier/");
    };

    return (
        <div className="submit-area">
            <div className="word-feedback-area">피드백</div>

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
