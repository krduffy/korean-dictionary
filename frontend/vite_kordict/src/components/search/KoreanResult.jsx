
import React from "react";
import "./korean-result-styles.css"

const KoreanResult = ({ result, clickedKorWordFunc, mouseOverHanFunc }) => {

  const isHanja = (character) => {
    const charCode = character.charCodeAt(0);
    /* 4E00 - 9FFF = CJK Unified ideographs */
    if (charCode >= 0x4E00 && charCode <= 0x9FFF) console.log ("ishanja");
    return charCode >= 0x4E00 && charCode <= 0x9FFF;
  }

  return (
    <div className="result_box">
      <p className="header">
        <span onClick={clickedKorWordFunc(result.kw_target_code)} className="word_header">
            {result.kw_word}
        </span>
            
        {'   '}

        {[...result.kw_origin].map((character, index) => (
          <span
            key={index}
            className={isHanja(character) ? "hover-glow" : ""}
            onMouseOver={() => {
              /* Call function if character is Hanja character */
              if (isHanja(character)) {
                mouseOverHanFunc(character);
              }
            }}
          >
            {character}
          </span>
        ))}
      </p>
      
      <ul className="listed_senses">
      { result.kw_senses.map((sense) => (
        <li key={sense.s_order}>
          {sense.s_order}.{' '}
          <span style={{ color: '#8e44ad' }}>{sense.s_pos}</span>{' '}
          <span style={{ color: '#3498db' }}>{sense.s_category}</span>{' '}
          {sense.s_definition}
        </li>
      ))}
      </ul>

      <p>출처: 우리말샘</p>
    </div>
  );
}

export default KoreanResult;