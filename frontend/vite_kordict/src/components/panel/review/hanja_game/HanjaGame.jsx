import React, { useContext, useEffect, useRef, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getNewSeed } from "../../../../../util/mathUtils.js";
import { HANJA_GAME_LENGTH } from "../../../../constants.js";
import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";
import { ViewContext } from "../../Panel.jsx";
import ErrorMessage from "../../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../../messages/LoadingMessage.jsx";
import ConnectionBoard from "./ConnectionBoard.jsx";
import SubmitArea from "./SubmitArea.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = ({ initialSeed }) => {
    const [currentGameData, setCurrentGameData] = useState({});

    /* just to prevent double rendering in strict mode. */
    const fetchedRef = useRef(false);

    const currentSeedRef = useRef(initialSeed);
    /* is initially not a random number because that would cause another api call
       on every load of the hanja game view */
    const nextSeedRef = useRef(initialSeed + 1234);

    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const updateCurrentViewInHistory =
        useContext(ViewContext)["updateCurrentViewInHistory"];

    const BLANK_BOARD = [
        [" ", " ", " ", " "],
        [" ", " ", " ", " "],
        [" ", " ", " ", " "],
        [" ", " ", " ", " "],
    ];
    const [connectionRows, setConnectionRows] = useState(BLANK_BOARD);

    const resetConnectionRows = () => {
        setConnectionRows(BLANK_BOARD);
    };

    const NO_HIGHLIGHTS = {
        to: [-1, -1, -1, -1, -1],
        from: [-1, -1, -1, -1, -1],
    };
    const [highlights, setHighlights] = useState(NO_HIGHLIGHTS);
    const updateHighlights = () => {
        if (
            !(
                currentGameData["start_from"]?.character &&
                currentGameData["go_to"]?.character
            )
        ) {
            return NO_HIGHLIGHTS;
        }

        const to = [-1, -1, -1, -1];
        const from = [-1, -1, -1, -1];

        for (let i = 0; i < connectionRows.length - 1; i++) {
            for (let j = 0; j < connectionRows[i].length; j++) {
                if (connectionRows[i][j] === " ") {
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

        let firstWord = -1,
            lastWord = -1;
        for (let i = 0; i < connectionRows.length; i++) {
            if (connectionRows[i].join("").trim().length > 0) {
                /* first word only gets written to once*/
                if (firstWord === -1) {
                    firstWord = i;
                }
                lastWord = i;
            }
        }
        if (firstWord != -1) {
            from[firstWord] = connectionRows[firstWord].indexOf(
                currentGameData["start_from"].character
            );
        }
        if (lastWord != -1) {
            to[lastWord] = connectionRows[lastWord].indexOf(
                currentGameData["go_to"].character
            );
        }

        setHighlights({
            to: to,
            from: from,
        });
    };

    const { apiFetch, apiPrefetch, loading, error, response, successful } =
        useAPIFetcher();

    const updateRowCol = (row, col, newValue) => {
        setConnectionRows((prevRows) => {
            let newRows = [...prevRows];
            newRows[row] = [...newRows[row]];
            newRows[row][col] = newValue;
            return newRows;
        });
    };

    const getGame = () => {
        const setData = async () => {
            const data = await apiFetch(
                `api/hanja_game_info/?length=${HANJA_GAME_LENGTH}&seed=${currentSeedRef.current}`,
                authInfo["token"]
            );

            apiPrefetch(
                `api/hanja_game_info/?length=${HANJA_GAME_LENGTH}&seed=${nextSeedRef.current}`,
                authInfo["token"]
            );

            setCurrentGameData(data);
            resetConnectionRows();
        };

        setData();
    };

    const getNextGame = () => {
        const setData = async () => {
            currentSeedRef.current = nextSeedRef.current;
            nextSeedRef.current = getNewSeed();

            getGame();

            const newView = {
                view: "hanja_game",
                value: currentSeedRef.current,
                searchBarInitialState: {
                    boxContent: "漢字",
                    dictionary: "hanja",
                },
            };
            updateCurrentViewInHistory(newView);
        };

        setData();
    };

    useEffect(() => {
        updateHighlights();
    }, [JSON.stringify(connectionRows)]);

    useEffect(() => {
        /* rapidly sent requests interweave on the server and cannot be the same, even
           for the same set of known words and seed. double effect runs in strict mode
           will cause changes in the list of supplied_word unless this ref guard is here
           to block anything past the first render. */
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            getGame();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="hanja-game-container">
                {loading ? (
                    <LoadingMessage />
                ) : error ? (
                    <ErrorMessage errorResponse={response} />
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
                    )
                )}
            </div>
        </DndProvider>
    );
};

export default HanjaGame;
