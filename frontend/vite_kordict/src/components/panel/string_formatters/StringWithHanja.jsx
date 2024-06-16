import HanjaCharacterSpan from "./HanjaCharacterSpan";

import React from "react";

import PropTypes from "prop-types";

import { isSingleHanja, isolateHanja } from "../../../../util/stringUtils.js";

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

const StringWithHanja = ({ string }) => {
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

export default StringWithHanja;
