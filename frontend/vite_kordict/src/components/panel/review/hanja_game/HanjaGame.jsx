import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getElementSizing } from "../../../../../util/domUtils.js";
import { HANJA_GAME_LENGTH } from "../../../../constants.js";
import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import HanjaCharacterSpan from "../../string_formatters/HanjaCharacterSpan.jsx";
import ConnectionBoard from "./ConnectionBoard.jsx";
import GameExplanationBox from "./GameExplanationBox.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = ({ initialSeed }) => {
    const [currentGameData, setCurrentGameData] = useState({});
    const [seed, setSeed] = useState(initialSeed);

    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const [connectionRows, setConnectionRows] = useState([
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
    ]);

    const getHighlights = () => {
        if (
            !(
                currentGameData["start_from"]?.character &&
                currentGameData["go_to"]?.character
            )
        ) {
            return {
                to: [-1, -1, -1, -1, -1],
                from: [-1, -1, -1, -1, -1],
            };
        }

        const to = [-1, -1, -1, -1];
        const from = [-1, -1, -1, -1];

        for (let i = 0; i < connectionRows.length - 1; i++) {
            for (let j = 0; j < connectionRows[i].length; j++) {
                if (connectionRows[i][j].length < 1) {
                    continue;
                }
                let index = -1;
                if (
                    (index = connectionRows[i + 1].indexOf(
                        connectionRows[i][j]
                    )) != -1
                ) {
                    to[i] = j;
                    from[i + 1] = index;
                }
            }
        }

        from[0] = connectionRows[0].indexOf(
            currentGameData["start_from"].character
        );
        to[3] = connectionRows[connectionRows.length - 1].indexOf(
            currentGameData["go_to"].character
        );

        return {
            to: to,
            from: from,
        };
    };

    const highlights = useMemo(() => {
        return getHighlights();
    }, [connectionRows]);

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
                            <div className="top-info">
                                <div>
                                    출발자:{" "}
                                    <HanjaCharacterSpan
                                        character={
                                            currentGameData["start_from"]
                                                .character
                                        }
                                        disableClick={true}
                                    />
                                </div>

                                <div>
                                    도착 자:{" "}
                                    <HanjaCharacterSpan
                                        character={
                                            currentGameData["go_to"].character
                                        }
                                        disableClick={true}
                                    />
                                </div>

                                <div style={{ textAlign: "left" }}>
                                    <InstructionQuestionMark
                                        start_from={
                                            currentGameData["start_from"]
                                                .character
                                        }
                                        go_to={
                                            currentGameData["go_to"].character
                                        }
                                    />
                                </div>
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
                                    highlights={highlights}
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
