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
                gap: "25px",
            }}
        >
            {page != 1 ? (
                <span
                    onClick={() => handleClick(1)}
                    className="clickable-result page-number-display"
                    style={{ flex: "1 1 0", textAlign: "center" }}
                >
                    1
                </span>
            ) : (
                <span
                    className="page-number-display"
                    style={{ flex: "1 1 0", textAlign: "center" }}
                >
                    -
                </span>
            )}

            {page - 1 > 0 ? (
                <button
                    style={{
                        backgroundColor: "var(--cyan)",
                        flex: "1 1 0",
                        textAlign: "center",
                    }}
                    onClick={() => handleClick(page - 1)}
                >
                    ◀
                </button>
            ) : (
                <button
                    style={{
                        cursor: "not-allowed",
                        backgroundColor: "transparent",
                        flex: "1 1 0",
                        textAlign: "center",
                    }}
                >
                    ◁
                </button>
            )}

            <span
                className="page-number-display"
                style={{ flex: "1 1 0", textAlign: "center" }}
            >
                {page}
            </span>

            {/* gray out the right button if there is no right page*/}
            {page + 1 <= numPages ? (
                <button
                    style={{
                        backgroundColor: "var(--cyan)",
                        flex: "1 1 0",
                        textAlign: "center",
                    }}
                    onClick={() => handleClick(page + 1)}
                >
                    ▶
                </button>
            ) : (
                <button
                    style={{
                        cursor: "not-allowed",
                        backgroundColor: "transparent",
                        flex: "1 1 0",
                        textAlign: "center",
                    }}
                >
                    ▷
                </button>
            )}

            {page < numPages ? (
                <span
                    onClick={() => handleClick(numPages)}
                    className="clickable-result page-number-display"
                    style={{ flex: "1 1 0", textAlign: "center" }}
                >
                    {numPages}
                </span>
            ) : (
                <span
                    className="page-number-display"
                    style={{ flex: "1 1 0", textAlign: "center" }}
                >
                    -
                </span>
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
