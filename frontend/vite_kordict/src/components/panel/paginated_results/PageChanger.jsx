import React from "react";

import PropTypes from "prop-types";

const PageChanger = ({
    page,
    hasNextPage,
    setPageFunction,
    hasInteractedRef,
}) => {
    const handleClick = (newPage) => {
        hasInteractedRef.current = true;
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

            <span id="page-number-display">{page}</span>

            {/* gray out the right button if there is no right page*/}
            {hasNextPage ? (
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
        </div>
    );
};

PageChanger.propTypes = {
    page: PropTypes.number.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    setPageFunction: PropTypes.func.isRequired,
};

export default PageChanger;
