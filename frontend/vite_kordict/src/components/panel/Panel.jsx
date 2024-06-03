import React, { createContext, useState } from "react";

import { useHistoryManager } from "../../hooks/useHistoryManager.js";

import HanjaCharView from "./detail_view/HanjaCharView.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import PanelHeader from "./fixed_header/PanelHeader.jsx";
import EditWordForm from "./forms/EditWordForm.jsx";
import GetUnknownWordsForm from "./forms/GetUnknownWordsForm.jsx";
import NewWordForm from "./forms/NewWordForm.jsx";
import HomePage from "./home/HomePage.jsx";
import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import HanjaGame from "./review/hanja_game/HanjaGame.jsx";

import "./panel-styles.css";

export const ViewContext = createContext(null);

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

    const [showPanelContent, setShowPanelContent] = useState(true);

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
                {(currentView["view"] === "search_korean" ||
                    currentView["view"] === "search_hanja") && (
                    <PaginatedResults
                        searchType={currentView["view"]}
                        searchTerm={currentView["value"]}
                    />
                )}

                {(currentView["view"] === "detail_korean" ||
                    currentView["view"] === "detail_hanja") && (
                    <div>
                        {currentView["view"] == "detail_korean" && (
                            <KoreanWordView targetCode={currentView["value"]} />
                        )}
                        {currentView["view"] == "detail_hanja" && (
                            <HanjaCharView hanjaChar={currentView["value"]} />
                        )}
                    </div>
                )}

                {currentView["view"] === "homepage" && (
                    <div>
                        <HomePage initialSeed={currentView["value"]} />
                    </div>
                )}

                {currentView["view"] === "hanja_game" && (
                    <div>
                        <HanjaGame />
                    </div>
                )}

                {currentView["view"] === "add_word" && (
                    <div>
                        <NewWordForm />
                    </div>
                )}

                {currentView["view"] === "edit_word" && (
                    <div>
                        <EditWordForm targetCode={currentView["value"]} />
                    </div>
                )}

                {currentView["view"] === "get_unknown_words" && (
                    <div>
                        <GetUnknownWordsForm />
                    </div>
                )}
            </div>

            <div
                className="horizontal-bar"
                style={{
                    marginTop: "40px",
                    marginBottom: "40px",
                }}
            />
        </ViewContext.Provider>
    );
};

export default Panel;
