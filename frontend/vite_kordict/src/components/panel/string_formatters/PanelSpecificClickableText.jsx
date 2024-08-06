import React, { useContext } from "react";

import { ViewContext } from "../Panel.jsx";

const PanelSpecificClickableText = ({ text, viewOnPush }) => {
    const pushView = useContext(ViewContext)["pushView"];

    const handleClick = (event) => {
        event.stopPropagation();
        pushView(event, viewOnPush);
    };

    const handleRightClick = (event) => {
        event.preventDefault();
        handleClick(event);
    };

    return (
        <span
            className="clickable-result"
            onClick={handleClick}
            onContextMenu={handleRightClick}
        >
            {text}
        </span>
    );
};

export default PanelSpecificClickableText;
