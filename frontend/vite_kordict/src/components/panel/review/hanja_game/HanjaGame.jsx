import React from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useHanjaGame } from "./useHanjaGame.js";

import LoadErrorOrChild from "../../messages/LoadErrorOrChild.jsx";
import ConnectionBoard from "./ConnectionBoard.jsx";
import SubmitArea from "./SubmitArea.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = ({ initialSeed }) => {
    const {
        currentGameData,
        connectionRows,
        highlights,
        loading,
        error,
        response,
        updateRowCol,
        getNextGame,
    } = useHanjaGame(initialSeed);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="hanja-game-container">
                <LoadErrorOrChild
                    loading={loading}
                    error={error}
                    response={response}
                >
                    {currentGameData?.supplied_characters && (
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
                                    highlights={highlights}
                                />
                                <SubmitArea
                                    allowedCharacters={
                                        currentGameData["supplied_characters"]
                                    }
                                    key={JSON.stringify(connectionRows)}
                                    words={connectionRows}
                                    startFrom={
                                        currentGameData["start_from"].character
                                    }
                                    goTo={currentGameData["go_to"].character}
                                    getNextGame={getNextGame}
                                />
                            </div>
                        </div>
                    )}
                </LoadErrorOrChild>
            </div>
        </DndProvider>
    );
};

export default HanjaGame;
