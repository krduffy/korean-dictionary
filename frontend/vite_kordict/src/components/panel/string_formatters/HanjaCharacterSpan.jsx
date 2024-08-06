import React, { useState } from "react";

import PropTypes from "prop-types";

import { getBasicDetailHanjaView } from "../../../../util/viewUtils.js";

import HanjaHoverBox from "./HanjaHoverBox.jsx";
import PanelSpecificClickableText from "./PanelSpecificClickableText.jsx";

import "./universal-styles.css";

const HanjaCharacterSpan = ({ character, overrideDisplay, disableClick }) => {
    const [showHoverBox, setShowHoverBox] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (event) => {
        event.stopPropagation();
        setShowHoverBox(true);
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = (event) => {
        event.stopPropagation();
        setShowHoverBox(false);
    };

    const getViewOnPush = () => {
        if (!disableClick) {
            return getBasicDetailHanjaView(character);
        }

        return null;
    };

    return (
        <>
            <PanelSpecificClickableText
                getViewOnPush={getViewOnPush}
                disableStyling={true}
            >
                <span
                    className="hanja-char"
                    onMouseOver={handleMouseEnter}
                    onMouseOut={handleMouseLeave}
                >
                    {overrideDisplay || character}
                </span>
            </PanelSpecificClickableText>
            {showHoverBox && (
                <HanjaHoverBox
                    character={character}
                    mouseX={mousePosition.x}
                    mouseY={mousePosition.y}
                />
            )}
        </>
    );
};

HanjaCharacterSpan.propTypes = {
    character: PropTypes.string.isRequired,
};

export default HanjaCharacterSpan;
