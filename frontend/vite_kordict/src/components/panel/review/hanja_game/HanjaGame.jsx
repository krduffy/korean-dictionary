import React, { useContext, useEffect, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import ConnectionBoard from "./ConnectionBoard.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = () => {
    const [currentGameData, setCurrentGameData] = useState({});
    const [currentGameLength, setCurrentGameLength] = useState(4);
    const [randomSeed, setRandomSeed] = useState(
        Math.floor(Math.random() * 1000000)
    );

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
        apiFetch(
            `http://127.0.0.1:8000/api/hanja_game_info/?length=${currentGameLength}&seed=${randomSeed}`,
            authInfo["token"],
            setCurrentGameData
        );
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
