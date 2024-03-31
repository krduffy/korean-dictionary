import React, { useState, useEffect, createContext } from "react";
import FixedHeader from "./fixed_header/PanelHeader.jsx";
import HomePage from "./home/HomePage.jsx";

import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";
import { useViewManager } from "./useViewManager.js";

export const ViewContext = createContext(null);

const Panel = () => {
  const {
    currentView,
    setCurrentView,
    historyPointer,
    setHistoryPointer,
    historySize,
    searchBarInitialState,
  } = useViewManager({
    initialView: { view: "homepage", value: 0 },
    initialSearchBarInitialState: {
      boxContent: "",
      dictionary: "korean",
    },
  });
  return (
    <ViewContext.Provider
      value={{
        currentView: currentView,
        setCurrentView: setCurrentView,
      }}
    >
      <FixedHeader
        historyPointer={historyPointer}
        setHistoryPointer={setHistoryPointer}
        historySize={historySize}
        searchBarInitialState={searchBarInitialState}
      />
      {/* Fixed header needs more than just setHistoryNeedsUpdating
             because it contains the ViewHistoryNavigator */}
      {console.log({
        currentView,
        setCurrentView,
        historyPointer,
        setHistoryPointer,
        historySize,
        searchBarInitialState,
      })}

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
