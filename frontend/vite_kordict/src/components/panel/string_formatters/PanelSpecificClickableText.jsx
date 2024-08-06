import React, { useContext } from "react";

import { ViewContext } from "../Panel.jsx";

const PanelSpecificClickableText = ({
    children,
    text,
    viewOnPush,
    getViewOnPush,
}) => {
    const pushView = useContext(ViewContext)["pushView"];

    const handleClick = async (event) => {
        event.stopPropagation();

        pushView(event, viewOnPush ? viewOnPush : await getViewOnPush());
        console.log(getViewOnPush());
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
            {children || text}
        </span>
    );
};

export default PanelSpecificClickableText;
