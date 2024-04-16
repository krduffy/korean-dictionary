import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import "./universal-styles.css";
import HanjaHoverBox from "./HanjaHoverBox";
import { ViewContext } from "./Panel";

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
  const [showHoverBox, setShowHoverBox] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];
  const currentView = useContext(ViewContext)["currentView"];

  const handleMouseEnter = (event) => {
    setShowHoverBox(true);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setShowHoverBox(false);
  };

  const fixBoxXToScreen = (x) => {
    return x > window.innerWidth / 2 ? x - 220 : x + 20;
  };

  const fixBoxYToScreen = (y) => {
    return y > window.innerHeight / 2 ? y - 220 : y + 20;
  };

  const notAlreadyViewing = () => {
    return (
      character != currentView["value"] &&
      currentView["view"] !== "hanja_detail"
    );
  };

  const viewHanjaDetail = () => {
    updateViewAndPushToHistory({
      view: "detail_hanja",
      value: character,
      searchBarInitialState: {
        boxContent: character,
        dictionary: "hanja",
      },
    });
  };

  return (
    <span>
      {showHoverBox && (
        <HanjaHoverBox
          character={character}
          x={fixBoxXToScreen(mousePosition.x)}
          y={fixBoxYToScreen(mousePosition.y)}
        />
      )}
      <span
        className="hanja-char"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: notAlreadyViewing() ? "pointer" : "" }}
        onClick={() => {
          if (notAlreadyViewing()) viewHanjaDetail(character);
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
