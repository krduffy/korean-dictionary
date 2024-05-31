import React, { useState } from "react";

import { useDrop } from "react-dnd";

import "./hanja-game-styles.css";

const ConnectionBoard = ({ rows, updateRowCol }) => {
    return (
        <div className="connection-board">
            {rows.map((characterList, rowId) =>
                characterList.map((character, columnId) => (
                    <div key={columnId}>
                        <ConnectionSquare
                            coords={[rowId, columnId]}
                            character={character}
                            updateRowCol={updateRowCol}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

const ConnectionSquare = ({ coords, character, updateRowCol }) => {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "character_square",
            drop: (item) => {
                updateRowCol(coords[0], coords[1], item.character);
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [coords[0], coords[1]]
    );

    return (
        <div className="connection-square" ref={drop}>
            <span className="connection-square-character">{character}</span>
            {character !== " " && (
                <button
                    className="clear-connection-square-button"
                    onClick={() => {
                        updateRowCol(coords[0], coords[1], " ");
                    }}
                >
                    x
                </button>
            )}
        </div>
    );
};

export default ConnectionBoard;
