import React, { useLayoutEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import { fitBoxX, fitBoxY } from "../../../../util/mathUtils.js";

import "./universal-styles.css";

const PopupBox = ({ children, fromX, fromY, positioning, padding }) => {
    const divRef = useRef(null);

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useLayoutEffect(() => {
        if (divRef.current) {
            const dim = divRef.current.getBoundingClientRect();
            const boxWidth = dim.width;
            const boxHeight = dim.height;

            switch (positioning) {
                case "fit":
                    setX(fitBoxX(fromX, boxWidth, padding));
                    setY(fitBoxY(fromY, boxHeight, padding));
                    break;
                case "above":
                    setX(fromX - boxWidth / 2);
                    setY(fromY - boxHeight - padding);
                    break;
                case "below":
                    setX(fromX - boxWidth / 2);
                    setY(fromY + padding);
                    break;
                case "exact":
                    setX(fromX);
                    setY(fromY);
            }
        }
    }, [fromX, fromY, padding, positioning]);

    return (
        <div
            ref={divRef}
            className="popup-box"
            style={{
                left: x,
                top: y,
            }}
        >
            {children}
        </div>
    );
};

PopupBox.propTypes = {
    children: PropTypes.node.isRequired,
    fromX: PropTypes.number.isRequired,
    fromY: PropTypes.number.isRequired,
    positioning: PropTypes.string.isRequired,
    padding: PropTypes.number,
};

export default PopupBox;
