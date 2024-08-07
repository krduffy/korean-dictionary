import React from "react";

import PropTypes from "prop-types";

const PageChanger = ({ page, numPages, setPageFunction, hasInteractedRef }) => {
    const handleClick = (newPage) => {
        if (hasInteractedRef?.current) {
            hasInteractedRef.current = true;
        }
        setPageFunction(newPage);
    };

    return (
        <div
            className="space-children-horizontal"
            style={{
                paddingLeft: "15%",
                paddingRight: "15%",
            }}
        >
            {/* gray out the left button if there is no left page*/}

            {page != 1 ? (
                <span
                    onClick={() => handleClick(1)}
                    className="clickable-result page-number-display"
                >
                    1
                </span>
            ) : (
                <span className="page-number-display">-</span>
            )}

            {page - 1 > 0 ? (
                <button
                    style={{ backgroundColor: "var(--cyan)" }}
                    onClick={() => handleClick(page - 1)}
                >
                    ◀
                </button>
            ) : (
                <button
                    style={{
                        cursor: "not-allowed",
                        backgroundColor: "transparent",
                    }}
                >
                    ◁
                </button>
            )}

            <span className="page-number-display">{page}</span>

            {/* gray out the right button if there is no right page*/}
            {page + 1 <= numPages ? (
                <button
                    style={{ backgroundColor: "var(--cyan)" }}
                    onClick={() => handleClick(page + 1)}
                >
                    ▶
                </button>
            ) : (
                <button
                    style={{
                        cursor: "not-allowed",
                        backgroundColor: "transparent",
                    }}
                >
                    ▷
                </button>
            )}

            {page < numPages ? (
                <span
                    onClick={() => handleClick(numPages)}
                    className="clickable-result page-number-display"
                >
                    {numPages}
                </span>
            ) : (
                <span className="page-number-display">-</span>
            )}
        </div>
    );
};

PageChanger.propTypes = {
    page: PropTypes.number.isRequired,
    numPages: PropTypes.number.isRequired,
    setPageFunction: PropTypes.func.isRequired,
};

export default PageChanger;
