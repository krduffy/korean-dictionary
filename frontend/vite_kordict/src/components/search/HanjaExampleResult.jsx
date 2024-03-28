
import React from "react"
import "./styles/hanja-example-result-styles.css";
import "./styles/hanja-char-styles.css";

const HanjaExampleResult = ({ result }) => {

  const isHanja = (character) => {
    const charCode = character.charCodeAt(0);
    /* 4E00 - 9FFF = CJK Unified ideographs */
    return charCode >= 0x4E00 && charCode <= 0x9FFF;
  }

  return (
    <div>
      <div className="hanja_example_word">
        {result["kw_word"]}
          (
            { [...result["kw_origin"]].map((character, id) => (
              <span className= { isHanja(character) ? "hanja-char" : ""} >{character}</span>
              ))
            }
          )
      </div>

      <div className="hanja_example_definition">
        {result["kw_first_definition"]}
      </div>
    </div>
  )
}

export default HanjaExampleResult;