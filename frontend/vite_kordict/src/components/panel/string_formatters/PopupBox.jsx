import React, { useLayoutEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import { fitBoxX, fitBoxY } from "../../../../util/mathUtils.js";

const PopupBox = ({ children, fromX, fromY }) => {
    const divRef = useRef(null);

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useLayoutEffect(() => {
        if (divRef.current) {
            const { boxHeight, boxWidth } =
                divRef.current.getBoundingClientRect();
            setX(fitBoxX(fromX, boxWidth, 10));
            setY(fitBoxY(fromY, boxHeight, 10));
        }
    }, [fromX, fromY]);

    return (
        <div
            ref={divRef}
            style={{
                x: x,
                y: y,
                position: "fixed",
                zIndex: 1000,
                display: "flexbox",
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
};

export default PopupBox;
