import React, { useState, useEffect } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";
import { LoadingMessage } from "../../../LoadingMessage.jsx";
import UsableCharactersBoard from "./UsableCharactersBoard.jsx";

const HanjaGame = () => {
  const [currentGameData, setCurrentGameData] = useState({});
  {
    /* 7 is a good length */
  }
  const [currentGameLength, setCurrentGameLength] = useState(7);

  const { apiFetch, loading } = useAPIFetcher();

  const generateGame = () => {
    apiFetch(
      "http://127.0.0.1:8000/api/hanja_game_info/?length=1",
      setCurrentGameData,
    );
  };

  useEffect(() => {
    generateGame();
  }, []);

  return (
    <div className="hanja-game-container">
      {loading ? (
        <LoadingMessage />
      ) : (
        currentGameData &&
        currentGameData["supplied_characters"] && (
          <UsableCharactersBoard
            charactersList={currentGameData["supplied_characters"]}
          />
        )
      )}
    </div>
  );
};

export default HanjaGame;
