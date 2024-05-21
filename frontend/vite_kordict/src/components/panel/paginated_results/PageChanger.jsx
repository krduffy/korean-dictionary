import React from "react";

import PropTypes from "prop-types";

import "./styles/page-changer-styles.css";

const PageChanger = ({ page, hasNextPage, setPageFunction }) => {
    const handleClick = (newPage) => {
        return () => {
            setPageFunction(newPage);
        };
    };

    return (
        <div id="page-changer-container-div">
            {/* gray out the left button if there is no left page*/}

            {page - 1 > 0 ? (
                <button
                    className="page-left-button"
                    id="page-left-button-exists"
                    onClick={handleClick(page - 1)}
                >
                    ◀
                </button>
            ) : (
                <button
                    className="page-left-button"
                    id="page-left-button-grayed-out"
                >
                    ◁
                </button>
            )}

            <div id="page-number-display">{page}</div>

            {/* gray out the right button if there is no right page*/}
            {hasNextPage ? (
                <button
                    className="page-right-button"
                    id="page-right-button-exists"
                    onClick={handleClick(page + 1)}
                >
                    ▶
                </button>
            ) : (
                <button
                    className="page-right-button"
                    id="page-right-button-grayed-out"
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
