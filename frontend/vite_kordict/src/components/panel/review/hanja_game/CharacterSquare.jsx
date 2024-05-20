import React from "react";
import ClipboardCopier from "../../string_formatters/ClipboardCopier";

import StringWithHanja from "../../string_formatters/StringWithHanja";
import HanjaCharacterSpan from "../../string_formatters/HanjaCharacterSpan";

const CharacterSquare = ({ character }) => {
  return (
    <span className="character-square">
      <span className="square-hanja">{character}</span>
      <HanjaCharacterSpan
        character={character}
        overrideDisplay={"?"}
        disableClick={true}
      />
      <ClipboardCopier string={character} />
    </span>
  );
};

export default CharacterSquare;
