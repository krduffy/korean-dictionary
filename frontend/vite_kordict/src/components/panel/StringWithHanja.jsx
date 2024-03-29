
import React from "react";
import "./universal-styles.css";

const StringWithHanja = ({ stringWithHanja, mouseOverHanFunc }) => {

  const isolateHanja = (string) => {
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return string.split(/([\u4e00-\u9fff])/g).filter((str) => str.length > 0);
  };

  const isSingleHanja = (string) => {
    if (string.length != 1) return false;
    
    /* 4E00 - 9FFF = CJK Unified ideographs */
    const charCode = string.charCodeAt(0);
    return charCode >= 0x4E00 && charCode <= 0x9FFF;
  };

  return (
    <span>
      {isolateHanja(stringWithHanja).map((substring, index) => (
        <span
          key={index}
          className={isSingleHanja(substring) ? "hanja-char" : ""}
          onMouseOver={() => {
            /* Call function if character is Hanja character */
            if (isSingleHanja(substring)) {
              mouseOverHanFunc(substring);
            }
          }}
        >
          {substring}
        </span>
      ))}
    </span>
  )
}

export default StringWithHanja;