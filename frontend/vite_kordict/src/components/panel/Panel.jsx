
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

  const [ currentView, setCurrentView ] = useState({"view": "homepage"});
  /* Values
     "view": search_korean, detail_korean, search_hanja, detail_hanja
     "value": search_term, [target_code, word], character, etc
  */
  
  /* History management */
  const [ historyNeedsUpdating, setHistoryNeedsUpdating ] = useState(false);
  const [ history, setHistory ] = useState([{"view": "homepage"}]);
  const [ historyTop, setHistoryTop ] = useState(0);
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

  /* All of these use effects trigger in a chain due to asynchronicity */
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