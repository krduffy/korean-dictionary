import React, { createContext } from "react";

import { usePanel } from "../../hooks/usePanel.jsx";
import PanelHeader from "./fixed_header/PanelHeader.jsx";

import "./panel-styles.css";

export const ViewContext = createContext(null);

/**
 * A Panel component for content that will occupy one half of the screen. Contains content to
 * make searches, display results, and other dictionary functions.
 *
 * @returns {React.JSX.Element} The rendered Panel component.
 */
const Panel = ({ panelFuncs }) => {
    const {
        currentView,
        updateViewAndPushToHistory,
        updateViewWithoutPushingToHistory,
        backToHomepage,
        //backToHanjaGameOrPushNewGame, unused currently
        showPanelContent,
        setShowPanelContent,
        getPanelContent,
        barIsAdded,

        /* Added by useDictionaryPanels */
        pushView,

        /* functions directly from use history manager */
        updateCurrentViewInHistory,
        canNavigateBack,
        getPrecedingView,
        canNavigateForward,
        getFollowingView,
    } = panelFuncs;

    return (
        <ViewContext.Provider
            value={{
                currentView: currentView,
                pushView: pushView,
                updateViewAndPushToHistory: updateViewAndPushToHistory,
                updateViewWithoutPushingToHistory:
                    updateViewWithoutPushingToHistory,
                updateCurrentViewInHistory: updateCurrentViewInHistory,
            }}
        >
            <PanelHeader
                canNavigateBack={canNavigateBack}
                getPrecedingView={getPrecedingView}
                canNavigateForward={canNavigateForward}
                getFollowingView={getFollowingView}
                showPanelContent={showPanelContent}
                setShowPanelContent={setShowPanelContent}
                backToHomepage={backToHomepage}
            />

            <div className={showPanelContent ? "panel" : "panel-hidden"}>
                {getPanelContent(currentView["view"], currentView["value"])}

                {/* bar under content as padding */}
                {barIsAdded(currentView["view"]) && (
                    <div
                        className="horizontal-bar"
                        style={{
                            marginTop: "40px",
                            marginBottom: "40px",
                        }}
                    />
                )}
            </div>
        </ViewContext.Provider>
    );
};

export default Panel;
