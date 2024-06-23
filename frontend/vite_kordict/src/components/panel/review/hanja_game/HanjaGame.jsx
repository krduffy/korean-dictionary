import React, { useContext, useEffect, useRef, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getElementSizing } from "../../../../../util/domUtils.js";
import { HANJA_GAME_LENGTH } from "../../../../constants.js";
import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import ConnectionBoard from "./ConnectionBoard.jsx";
import GameExplanationBox from "./GameExplanationBox.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = ({ initialSeed }) => {
    const [currentGameData, setCurrentGameData] = useState({});
    const [seed, setSeed] = useState(initialSeed);

    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const [connectionRows, setConnectionRows] = useState([
        ["男", "男", "男", "男"],
        ["男", "男", "男", "男"],
        ["男", "男", "男", "男"],
        ["男", "男", "男", "男"],
    ]);

    const { apiFetch, loading } = useAPIFetcher();

    const updateRowCol = (row, col, newValue) => {
        setConnectionRows((prevRows) => {
            let newRows = [...prevRows];
            newRows[row] = [...newRows[row]];
            newRows[row][col] = newValue;
            return newRows;
        });
    };

    const generateGame = () => {
        const setData = async () => {
            const data = await apiFetch(
                `api/hanja_game_info/?length=${HANJA_GAME_LENGTH}&seed=${seed}`,
                authInfo["token"]
            );
            setCurrentGameData(data);
        };

        setData();
    };

    useEffect(() => {
        generateGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="hanja-game-container">
                {loading ? (
                    <LoadingMessage />
                ) : (
                    currentGameData &&
                    currentGameData["supplied_characters"] && (
                        <div className="game-container">
                            <div>
                                {currentGameData["start_from"].character}
                                {currentGameData["go_to"].character}

                                <InstructionQuestionMark
                                    start_from={
                                        currentGameData["start_from"].character
                                    }
                                    go_to={currentGameData["go_to"].character}
                                />
                            </div>
                            <div className="game-top">
                                <UsableCharactersBoard
                                    charactersList={
                                        currentGameData["supplied_characters"]
                                    }
                                />
                            </div>
                            <div className="game-bottom">
                                <ConnectionBoard
                                    rows={connectionRows}
                                    updateRowCol={updateRowCol}
                                />
                            </div>
                        </div>
                    )
                )}
            </div>
        </DndProvider>
    );
};

export default HanjaGame;

const InstructionQuestionMark = ({ start_from, go_to }) => {
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
                    console.log("in");
                }}
                onMouseLeave={() => setShowInstructions(false)}
            >
                ?
            </span>
            {showInstructions && renderInstructions()}
        </>
    );
};
