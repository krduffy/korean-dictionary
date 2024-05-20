import React, { useState } from "react";

import "./hanja-game-styles.css";

const ConnectionBoard = ({ rows }) => {
  return (
    <div className="connection-board">
      {rows.map((characterList, rowId) =>
        characterList.map((character, columnId) => (
          <div key={columnId}>
            <ConnectionSquare character={character} />
          </div>
        )),
      )}
    </div>
  );
};

const ConnectionSquare = ({ character }) => {
  return <div className="connection-square">{character}</div>;
};

export default ConnectionBoard;
