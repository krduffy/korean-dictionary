import React from "react";
import ClipboardCopier from "../../string_formatters/ClipboardCopier";

import HanjaCharacterSpan from "../../string_formatters/HanjaCharacterSpan";

import "./hanja-game-styles.css";

const CharacterSquare = ({ character }) => {
  return (
    <div className="character-square">
      <div className="character-square-left-side">
        <span className="square-hanja">{character}</span>
      </div>
      <div className="character-square-right-side">
        <div className="question-mark-container">
          <HanjaCharacterSpan
            character={character}
            overrideDisplay={"?"}
            disableClick={true}
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
