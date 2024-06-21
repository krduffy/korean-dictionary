import { fitBoxX, fitBoxY } from "../../../../util/mathUtils";
import { ViewContext } from "../Panel";
import HanjaHoverBox from "./HanjaHoverBox";

import React, { useContext, useState } from "react";

import PropTypes from "prop-types";

import "./universal-styles.css";

const HanjaCharacterSpan = ({ character, overrideDisplay, disableClick }) => {
    const [showHoverBox, setShowHoverBox] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];
    const currentView = useContext(ViewContext)["currentView"];

    const handleMouseEnter = (event) => {
        event.stopPropagation();
        setShowHoverBox(true);
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = (event) => {
        event.stopPropagation();
        setShowHoverBox(false);
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

    const handleClick = (event) => {
        event.stopPropagation();
        if (!disableClick && notAlreadyViewing()) viewHanjaDetail(character);
    };

    return (
        <span>
            {showHoverBox && (
                <HanjaHoverBox
                    character={character}
                    /* Width and height of box both 200 */
                    x={fitBoxX(mousePosition.x, 200, 10)}
                    y={fitBoxY(mousePosition.y, 200, 10)}
                />
            )}
            <span
                className="hanja-char"
                onMouseOver={handleMouseEnter}
                onMouseOut={handleMouseLeave}
                style={{ cursor: notAlreadyViewing() ? "pointer" : "" }}
                onClick={handleClick}
            >
                {overrideDisplay ? overrideDisplay : character}
            </span>
        </span>
    );
};

HanjaCharacterSpan.propTypes = {
    character: PropTypes.string.isRequired,
};

export default HanjaCharacterSpan;
