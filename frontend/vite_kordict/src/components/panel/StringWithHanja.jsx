import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./universal-styles.css";
import HanjaHoverBox from "./HanjaHoverBox";

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

const StringWithHanja = ({ string }) => {
  const isolateHanja = (originalString) => {
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return originalString
      .split(/([\u4e00-\u9fff])/g)
      .filter((str) => str.length > 0);
  };

  const isSingleHanja = (substr) => {
    if (substr.length !== 1) return false;
    const charCode = substr.charCodeAt(0);
    return charCode >= 0x4e00 && charCode <= 0x9fff;
  };

  return (
    <span>
      {string &&
        isolateHanja(string).map((substring, index) => (
          <span key={index}>
            {isSingleHanja(substring) ? (
              <HanjaCharacterSpan character={substring} />
            ) : (
              <span>{substring}</span>
            )}
          </span>
        ))}
    </span>
  );
};

StringWithHanja.propTypes = {
  string: PropTypes.string.isRequired,
};

const HanjaCharacterSpan = ({ character }) => {
  const [hoverBoxEnabled, setHoverBoxEnabled] = useState(false);
  const [mouseIn, setMouseIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (mouseIn) {
        setHoverBoxEnabled(true);
      } else {
        setHoverBoxEnabled(false);
      }
    }, 1000);
  }, [mouseIn]);

  return (
    <span>
      {hoverBoxEnabled && <HanjaHoverBox character={character} />}
      <span
        className="hanja-char"
        onMouseEnter={() => {
          setMouseIn(true);
        }}
        onMouseLeave={() => {
          setMouseIn(false);
        }}
      >
        {character}
      </span>
    </span>
  );
};

HanjaCharacterSpan.propTypes = {
  character: PropTypes.string.isRequired,
};

export default StringWithHanja;
