import React from "react";

import { useDrag } from "react-dnd";

import CharacterSquare from "./CharacterSquare.jsx";

import "./hanja-game-styles.css";

const UsableCharactersBoard = ({ charactersList }) => {
    return (
        <div className="usable-characters-board-container">
            <div>제공 한자</div>
            <div className="usable-characters-board">
                {charactersList.map((character, id) => (
                    <CharacterSquare character={character} key={id} />
                ))}
            </div>
        </div>
    );
};

export default UsableCharactersBoard;
