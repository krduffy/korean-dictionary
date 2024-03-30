
import React from "react";
import "./universal-styles.css";

/*
 * A React component that takes in a string containing both Hanja characters and other text, 
 * and returns a JSX element. Each Hanja character in the input string is wrapped in a 
 * separate <span> element, allowing for individual styling and event handling.
 *
 * Example:
 * If stringWithHanja === "The character 金 means gold.",
 * This component will return:
 *  <span>
 *    <span>The character </span><span className="hanja-char">金</span><span> means gold.</span>
 *  </span>
 *
 * Props:
 * - stringWithHanja (string): The input string containing both Hanja characters and other text.
 */

const StringWithHanja = ({ stringWithHanja }) => {

  const isolateHanja = (string) => {
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return string.split(/([\u4e00-\u9fff])/g).filter((str) => str.length > 0);
  };

  const isSingleHanja = (string) => {
    if (string.length != 1) return false;
    const charCode = string.charCodeAt(0);
    return charCode >= 0x4E00 && charCode <= 0x9FFF;
  };

  return (
    <span>
      {stringWithHanja && isolateHanja(stringWithHanja).map((substring, index) => (
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