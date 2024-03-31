import React, { useState, useEffect, createContext } from "react";
import FixedHeader from "./fixed_header/PanelHeader.jsx";
import HomePage from "./home/HomePage.jsx";

import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";

export const ViewContext = createContext(null);
export const EntireHistoryContext = createContext(null);

const Panel = () => {
  /*
    Every state of the panel can be defined by a view and a value.
    Possible views are "homepage", "search_korean", "search_hanja", "detail_korean",
    "detail_hanja"
    These views are also stored in the history of the panel (see below).

    If the user searches "것" in the Korean dictionary, currentView will be set to
      {
        "view": "search_korean",
        "value": "것",
      }

    How "value" is interpreted depends on "view":
      view          | value interpretation
      ==============|======================== 
      homepage      | (none)
      search_korean | search term (example: 줄, 바르락, 卽時)
      search_hanja  | search term (example: 時공간, 성, 畫龍點睛)
      detail_korean | target code [pk into database] (example: 98118, 24576)
      detail_hanja  | character [pk into database] (example: 畫, 龍, 點, 睛)

    Additionally, if view is set to "detail_korean", a third field "detail_korean_word"
    is present in the view; this is used only to put into the search text box if the
    detail_korean view is ever restored from history (to avoid api call on restore).
   */
  const [currentView, setCurrentView] = useState({ view: "homepage" });

  /* History management */
  const [historyNeedsUpdating, setHistoryNeedsUpdating] = useState(false);

  /* 
    History is stored as an array of views.
    [{"view: "homepage}, {"view": "search_korean", "value": "가다"}, ...] for example
   */
  const [history, setHistory] = useState([{ view: "homepage" }]);
  /* historySize is the logical size of history */
  const [historySize, setHistorySize] = useState(0);
  /*
   * historyPointer is the index of the current view in history.
   * If history is composed of views v0, v1, v2, with historyPointer set at v2, click back will move
   * historyPointer to v1.
   *
   *   v0   v1   v2
   *        ^
   *       ptr
   *
   * If a new view v3 is then rendered, history will overwrite v2 and become:
   *
   *   v0   v1   v3
   *             ^
   *            ptr
   */
  const [historyPointer, setHistoryPointer] = useState(0);

  /* What to populate the search bar with when a state from history is restored; purely aesthetic */
  const [searchBarInitialState, setSearchBarInitialState] = useState({
    boxContent: "",
    dictionary: "korean",
  });

  /* Util */
  const dictionaryFromView = (viewString) => {
    if (viewString === "search_korean" || viewString === "detail_korean")
      return "korean";
    else if (viewString === "search_hanja" || viewString === "detail_hanja")
      return "hanja";
  };

  /* Performs a deep comparison of 2 views */
  const viewsIdentical = (view1, view2) => {
    if (view1["view"] !== view2["view"]) return false;
    if (view1["value"] !== view2["value"]) return false;
    return true;
  };

  /* Callbacks
    All of these use effects trigger in a chain to enforce synchronicity
    setCurrentView can be called by the following child components:
    1. fixed_header/SearchBar
    2. paginated_results/PaginatedResults (-> KoreanResult and HanjaResult)

    setHistoryPointer is only called in this Panel component and in fixed_header/ViewHistoryNavigator

    *There is a difference between changing these two things that correspond to two
    entrypoints into the useEffects!*

    Changing currentView is a certain change in view called when the user searches anything,
    clicks on anything that directs them to a page, etc. It is only after currentView has changed
    that it is checked whether there is an actual change in the history. If there is, the 
    callbacks start.

    Changing historyPointer is an uncertain change in view and is a "shortcut" to the end of the
    callbacks. Because it is only called by ViewHistoryNavigator and ViewHistoryNavigator
    cannot change history, there is no need to check and update it. However,  
    
    The reason for this callback hell implementation of a history feature
    is that the panels need separate histories that are stored separately and can be
    navigated without any effect on each other.
  */

  /* Entry point for any search made or word detail clicked on */
  useEffect(() => {
    /* Check that the user hasn't just paged back and forth from the same view
       before updating anything */
    if (!viewsIdentical(currentView, history[historyPointer])) {
      setHistoryNeedsUpdating(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  /* History needs updating whenever a brand new view is loaded (as opposed to reloading a previous one) */
  useEffect(() => {
    if (historyNeedsUpdating) {
      if (
        historyPointer == 0 &&
        viewsIdentical(currentView, { view: "homepage" })
      ) {
        //do nothing; just mounted and this is a false alarm
      } else if (historyPointer + 1 == historySize) {
        /*Need to force newHistory to be a new size even if the history is technically
          the same size; this would happen if you make several searches and then go back
          once and then make a new search. (ie historyPointer + 1 == historySize) Only one view 
          would normally be overwritten, but this does not lead to a different address for 
          history, meaning the next use effect would not be triggered and the history would 
          still include what should have been overwritten. */
        const newHistory = structuredClone(history).slice(
          0,
          historyPointer + 1,
        );
        newHistory.push(currentView);
        setHistory(newHistory);
      } else {
        setHistorySize(historyPointer + 1);
      }
      setHistoryNeedsUpdating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyNeedsUpdating]);

  /* THEN (assuming not edge case explained above) */

  useEffect(() => {
    /* Prevent trigger on mount by checking > 0 */
    if (historySize > 0) {
      const newHistory = history.slice(0, historyPointer + 1);
      newHistory.push(currentView);

      setHistory(newHistory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historySize]);

  /* THEN */

  /* Finally set historyPointer so next update functions correctly */
  useEffect(() => {
    setHistoryPointer(historySize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  /* THEN */

  useEffect(() => {
    /* unnecessary if from the callbacks above but here for when ViewHistoryNavigator
         calls setHistoryPointer */
    setCurrentView(history[historyPointer]);

    if (history[historyPointer]["view"] === "detail_korean") {
      setSearchBarInitialState({
        boxContent: history[historyPointer]["detail_korean_word"],
        dictionary: dictionaryFromView(history[historyPointer]["view"]),
      });
    } else if (history[historyPointer]["view"] != "homepage") {
      setSearchBarInitialState({
        boxContent: history[historyPointer]["value"],
        dictionary: dictionaryFromView(history[historyPointer]["view"]),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyPointer]);

  return (
    <ViewContext.Provider
      value={{
        currentView: currentView,
        setCurrentView: setCurrentView,
      }}
    >
      <EntireHistoryContext.Provider
        value={{
          historyPointer: historyPointer,
          setHistoryPointer: setHistoryPointer,
          history: history,
          historySize: historySize,
          searchBarInitialState: searchBarInitialState,
        }}
      >
        <FixedHeader />
        {/* Fixed header needs more than just setHistoryNeedsUpdating
             because it contains the ViewHistoryNavigator */}
      </EntireHistoryContext.Provider>

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
