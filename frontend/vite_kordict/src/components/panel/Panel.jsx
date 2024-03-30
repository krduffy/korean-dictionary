
import React, { useState, useEffect, createContext } from "react";
import FixedHeader from "./fixed_header/PanelHeader.jsx";
import HomePage from "./home/HomePage.jsx";

import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";

export const ViewContext = createContext(null);
export const UpdateHistoryContext = createContext(null);
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
  const [ currentView, setCurrentView ] = useState({"view": "homepage"});
  
  /* History management */
  const [ historyNeedsUpdating, setHistoryNeedsUpdating ] = useState(false);

  /* 
    History is stored as an array of views.
    [{"view: "homepage}, {"view": "search_korean", "value": "가다"}, ...] for example
   */
  const [ history, setHistory ] = useState([{"view": "homepage"}]);
  /* historyTop is the logical size of history */
  const [ historyTop, setHistoryTop ] = useState(0);
  /* 
   * Pointer is the index of the current view in history.
   * If history is composed of views v0, v1, v2, with pointer set at v2, click back will move
   * pointer to v1.
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
  const [ pointer, setPointer ] = useState(0);

  const [ searchInitialState, setSearchInitialState ] = useState(
    {
      "boxContent": "",
      "dictionary": "korean",
    }
  );

  const dictionaryFromView = (viewString) => {
    if(viewString === "search_korean" || viewString === "detail_korean")
      return "korean";
    else if(viewString === "search_hanja" || viewString === "detail_hanja")
      return "hanja";
  };

  /* All of these use effects trigger in a chain to enforce synchronicity */
  /* History needs updating whenever a brand new view is loaded (as opposed to reloading a previous one) */
  useEffect(() => {
    if(historyNeedsUpdating) {
      setHistoryTop(pointer + 1);
      setHistoryNeedsUpdating(false);
    }
  }, [historyNeedsUpdating]);
  
  /* THEN */
  
  useEffect(() => {
    const updatedHistory = [...history.slice(0, historyTop)];
    updatedHistory[historyTop] = currentView;
    setHistory(updatedHistory);
  }, [historyTop]);
  
  /* THEN */
  
  useEffect(() => {
    if(historyTop >= 0)
      setPointer(historyTop);
  }, [history]);
  
  /* THEN */
  
  useEffect(() => {
    if (pointer != -1) {
      console.log("History: ");
      console.log(history);

      setCurrentView(history[pointer]);

      if(history[pointer]["view"] === "detail_korean")
      {
        setSearchInitialState({
        "boxContent": history[pointer]["detail_korean_word"],
        "dictionary": dictionaryFromView(history[pointer]["view"]),
        });
      }
      else if(history[pointer]["view"] != "homepage")
      {
        setSearchInitialState({
          "boxContent": history[pointer]["value"],
          "dictionary": dictionaryFromView(history[pointer]["view"]),
          });
      }
    }
  }, [pointer]);

  return (
    <ViewContext.Provider value={{"currentView": currentView, "setCurrentView": setCurrentView}}>
    
      <EntireHistoryContext.Provider value= {
        {
          "setHistoryNeedsUpdating": setHistoryNeedsUpdating,
          "pointer": pointer,
          "setPointer": setPointer,
          "historyTop": historyTop,
          "searchInitialState": searchInitialState,
        }
      }>
        <FixedHeader /> 
        { /* Fixed header needs more than just setHistoryNeedsUpdating
             because it contains the ViewHistoryNavigator */ }
      </EntireHistoryContext.Provider>
      
      <UpdateHistoryContext.Provider value={setHistoryNeedsUpdating}>
        {(currentView["view"] === "search_korean" || currentView["view"] === "search_hanja") 
          &&
          <PaginatedResults searchType={currentView["view"]} searchTerm={currentView["value"]} />
        }

        {(currentView["view"] === "detail_korean" || currentView["view"] === "detail_hanja") 
          &&
            <div>
              {currentView["view"] == "detail_korean" &&
                <KoreanWordView targetCode={currentView["value"]} />
              }
              {currentView["view"] == "detail_hanja" &&
                <HanjaCharView hanjaChar={currentView["value"]} />
              }
            </div>
        }

        {(currentView["view"] === "homepage")
          &&
            <div>
              <HomePage />
            </div>
        }
      </UpdateHistoryContext.Provider>
    </ViewContext.Provider>
  );
}

export default Panel;