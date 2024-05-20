import React from "react";
import { useDrag } from "react-dnd";

import CharacterSquare from "./CharacterSquare";

import "./hanja-game-styles.css";

const UsableCharactersBoard = ({ charactersList }) => {
  return (
    <div className="usable-characters-board">
      {charactersList.map((character, id) => (
        <CharacterSquare character={character} key={id} />
      ))}
    </div>
  );
};

export default UsableCharactersBoard;
