import React, { useEffect, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";

import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import ConnectionBoard from "./ConnectionBoard.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = () => {
    const [currentGameData, setCurrentGameData] = useState({});
    {
        /* 7 is a good length */
    }
    const [currentGameLength, setCurrentGameLength] = useState(3);
    const [randomSeed, setRandomSeed] = useState(
        Math.floor(Math.random() * 1000000)
    );

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
            setCurrentGameData
        );
    };

    useEffect(() => {
        generateGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="hanja-game-container">
            {loading ? (
                <LoadingMessage />
            ) : (
                currentGameData &&
                currentGameData["supplied_characters"] && (
                    <div className="game-boards">
                        <UsableCharactersBoard
                            charactersList={
                                currentGameData["supplied_characters"]
                            }
                        />
                        <ConnectionBoard rows={connectionRows} />
                    </div>
                )
            )}
        </div>
    );
};

export default HanjaGame;
