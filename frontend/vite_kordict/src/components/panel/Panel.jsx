import React, { useState, createContext } from "react";
import PanelHeader from "./fixed_header/PanelHeader.jsx";
import HomePage from "./home/HomePage.jsx";

import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";
import { useHistoryManager } from "./useHistoryManager.js";

export const ViewContext = createContext(null);

const Panel = () => {
  const [currentView, setCurrentView] = useState({
    view: "homepage",
    value: 0,
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
  } = useHistoryManager({
    view: "homepage",
    value: 0,
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

  return (
    <ViewContext.Provider
      value={{
        currentView: currentView,
        updateViewAndPushToHistory: updateViewAndPushToHistory,
        updateViewWithoutPushingToHistory: updateViewWithoutPushingToHistory,
      }}
    >
      <PanelHeader
        canNavigateBack={canNavigateBack}
        getPrecedingView={getPrecedingView}
        canNavigateForward={canNavigateForward}
        getFollowingView={getFollowingView}
      />

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
          <HomePage />
        </div>
      )}
    </ViewContext.Provider>
  );
};

export default Panel;
