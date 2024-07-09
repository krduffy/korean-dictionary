import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import "./truncator-dropdown-styles.css";

const TruncatorDropdown = ({ children, onCollapse }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight =
                contentRef.current.getBoundingClientRect().height;
            setShowButton(contentHeight == 100);
        }
    }, [children]);

    return (
        <div className="truncator-dropdown">
            <div className="expansion-controller">
                <div
                    className={
                        showButton
                            ? isExpanded
                                ? "retract-line-shortened-expanded"
                                : "retract-line-shortened-unexpanded"
                            : "retract-line-unshortened"
                    }
                    onClick={() => {
                        if (isExpanded) {
                            onCollapse();
                        }
                        setIsExpanded(false);
                    }}
                ></div>
                {showButton && (
                    <div
                        className="expand-button"
                        onClick={() => {
                            if (isExpanded) {
                                onCollapse();
                            }
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? "▲" : "▼"}
                    </div>
                )}
            </div>

            <div
                className={isExpanded ? "content-entire" : "content-truncated"}
                ref={contentRef}
            >
                {children}
            </div>
        </div>
    );
};

TruncatorDropdown.propTypes = {
    children: PropTypes.node.isRequired,
};

export default TruncatorDropdown;
