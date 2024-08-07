import React from "react";

import { useDrag } from "react-dnd";

import ClipboardCopier from "../../string_formatters/ClipboardCopier.jsx";
import HanjaCharacterSpan from "../../string_formatters/HanjaCharacterSpan.jsx";

import "./hanja-game-styles.css";

const CharacterSquare = ({ character, itemTypes }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "character_square",
        item: { character },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div className="character-square">
            <div className="character-square-left-side" ref={drag}>
                <span className="square-hanja">{character}</span>
            </div>
            <div className="character-square-right-side">
                <div className="question-mark-container">
                    <HanjaCharacterSpan
                        character={character}
                        overrideDisplay={"?"}
                    />
                </div>
                <div className="copier-container">
                    <ClipboardCopier string={character} />
                </div>
            </div>
        </div>
    );
};

export default CharacterSquare;
