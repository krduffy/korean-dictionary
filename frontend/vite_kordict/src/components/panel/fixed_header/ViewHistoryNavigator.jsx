import React, { useContext } from "react";

import PropTypes from "prop-types";

import { ViewContext } from "../Panel.jsx";

import "./styles/fixed-header-styles.css";

const ViewHistoryNavigator = ({
    canNavigateBack,
    getPrecedingView,
    canNavigateForward,
    getFollowingView,
}) => {
    const updateViewWithoutPushingToHistory =
        useContext(ViewContext)["updateViewWithoutPushingToHistory"];

    return (
        <div className="view-history-navigator">
            <button
                className={
                    canNavigateBack()
                        ? "enabled-navigation-button"
                        : "disabled-navigation-button"
                }
                onClick={() => {
                    if (canNavigateBack()) {
                        updateViewWithoutPushingToHistory(getPrecedingView());
                    }
                }}
                title="한 페이지 뒤로 가기"
            >
                {canNavigateBack() ? "◀" : "◁"}
            </button>
            <button
                className={
                    canNavigateForward()
                        ? "enabled-navigation-button"
                        : "disabled-navigation-button"
                }
                onClick={() => {
                    if (canNavigateForward()) {
                        updateViewWithoutPushingToHistory(getFollowingView());
                    }
                }}
                title="한 페이지 앞으로 가기"
            >
                {canNavigateForward() ? "▶" : "▷"}
            </button>
        </div>
    );
};

ViewHistoryNavigator.propTypes = {
    canNavigateBack: PropTypes.func.isRequired,
    getPrecedingView: PropTypes.func.isRequired,
    canNavigateForward: PropTypes.func.isRequired,
    getFollowingView: PropTypes.func.isRequired,
};

export default ViewHistoryNavigator;
