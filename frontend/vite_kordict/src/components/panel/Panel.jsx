import React, { createContext, useState } from "react";

import { useHistoryManager } from "../../hooks/useHistoryManager.js";

import HanjaCharView from "./detail_view/HanjaCharView.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import { UserNoteDetail } from "./detail_view/UserNote.jsx";
import PanelHeader from "./fixed_header/PanelHeader.jsx";
import EditWordForm from "./forms/EditWordForm.jsx";
import GetUnknownWordsForm from "./forms/GetUnknownWordsForm.jsx";
import HomePage from "./home/HomePage.jsx";
import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import HanjaGame from "./review/hanja_game/HanjaGame.jsx";

import "./panel-styles.css";

export const ViewContext = createContext(null);

/**
 * A Panel component for content that will occupy one half of the screen. Contains content to
 * make searches, display results, and other dictionary functions.
 *
 * @returns {React.JSX.Element} The rendered Panel component.
 */
const Panel = () => {
    const initialHomepageSeed = Math.floor(Math.random() * 1000000);

    const [currentView, setCurrentView] = useState({
        view: "homepage",
        value: initialHomepageSeed,
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    });

    const {
        pushViewToHistory,
        canNavigateBack,
        getPrecedingView,
        canNavigateForward,
        getFollowingView,
        updateCurrentViewInHistory,
    } = useHistoryManager({
        view: "homepage",
        value: initialHomepageSeed,
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    });

    const updateViewAndPushToHistory = (newView) => {
        pushViewToHistory(newView);
        setCurrentView(newView);
    };

    const updateViewWithoutPushingToHistory = (newView) => {
        setCurrentView(newView);
    };

    /* Whether to have display: none or not */
    const [showPanelContent, setShowPanelContent] = useState(true);

    const getPanelContent = (view, value) => {
        switch (view) {
            case "search_korean":
            case "search_hanja":
            case "known_words":
            case "study_words":
                return (
                    <PaginatedResults searchType={view} searchTerm={value} />
                );
            case "detail_korean":
                return <KoreanWordView targetCode={value} />;
            case "detail_hanja":
                return <HanjaCharView hanjaChar={value} />;
            case "homepage":
                return <HomePage initialSeed={value} />;
            case "hanja_game":
                return <HanjaGame />;
            /* Add word is not currently in the application */
            case "edit_word":
                return <EditWordForm targetCode={value} />;
            case "get_unknown_words":
                return <GetUnknownWordsForm />;
            case "detail_note":
                return <UserNoteDetail noteData={value} />;
        }
    };

    return (
        <ViewContext.Provider
            value={{
                currentView: currentView,
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
            />

            <div className={showPanelContent ? "panel" : "panel-hidden"}>
                {getPanelContent(currentView["view"], currentView["value"])}

                {/* bar under content as padding */}
                <div
                    className="horizontal-bar"
                    style={{
                        marginTop: "40px",
                        marginBottom: "40px",
                    }}
                />
            </div>
        </ViewContext.Provider>
    );
};

export default Panel;
