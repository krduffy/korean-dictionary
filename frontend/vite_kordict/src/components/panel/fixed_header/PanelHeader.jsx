import React, { useContext } from "react";

import PropTypes from "prop-types";

import { ViewContext } from "../Panel.jsx";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";

import "./styles/fixed-header-styles.css";

const PanelHeader = ({
    canNavigateBack,
    getPrecedingView,
    canNavigateForward,
    getFollowingView,
    showPanelContent,
    setShowPanelContent,
}) => {
    const currentView = useContext(ViewContext)["currentView"];
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];

    return (
        <>
            <div className="fixed-header">
                <button
                    onClick={() => {
                        if (currentView.view !== "homepage") {
                            updateViewAndPushToHistory({
                                view: "homepage",
                                value: 0,
                                searchBarInitialState: {
                                    boxContent: "",
                                    dictionary: "korean",
                                },
                            });
                        }
                    }}
                >
                    🏠
                </button>

                <SearchBar />
                <ViewHistoryNavigator
                    canNavigateBack={canNavigateBack}
                    getPrecedingView={getPrecedingView}
                    canNavigateForward={canNavigateForward}
                    getFollowingView={getFollowingView}
                />

                <button
                    onClick={() => {
                        setShowPanelContent(!showPanelContent);
                    }}
                >
                    {showPanelContent ? "⇩" : "⇧"}
                </button>
            </div>
        </>
    );
};

PanelHeader.propTypes = {
    canNavigateBack: PropTypes.func.isRequired,
    getPrecedingView: PropTypes.func.isRequired,
    canNavigateForward: PropTypes.func.isRequired,
    getFollowingView: PropTypes.func.isRequired,
};

export default PanelHeader;
