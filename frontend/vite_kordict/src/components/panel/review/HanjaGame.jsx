import React, { useState, useEffect } from "react";
import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { LoadingMessage } from "../../LoadingMessage.jsx";

const HanjaGame = () => {
  const [currentGameData, setCurrentGameData] = useState({});
  {
    /* 7 is a good length */
  }
  const [currentGameLength, setCurrentGameLength] = useState(7);

  const { apiFetch, loading } = useAPIFetcher();

  const generateGame = () => {
    apiFetch(
      "http://127.0.0.1:8000/api/hanja_game_info/?length=6",
      setCurrentGameData,
    );
  };

  return (
    <div className="hanja-game-container">
      {loading ? (
        <LoadingMessage />
      ) : (
        <React.Fragment>
          <div onClick={generateGame}>생성</div>
          <div className="game-rules">
            {currentGameData["start_from"] && (
              <span>
                {currentGameData["start_from"]["character"]}{" "}
                {currentGameData["start_from"]["meaning_reading"]}
              </span>
            )}
            ⇒
            {currentGameData["go_to"] && (
              <span>
                {currentGameData["go_to"]["character"]}{" "}
                {currentGameData["go_to"]["meaning_reading"]}
              </span>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default HanjaGame;
