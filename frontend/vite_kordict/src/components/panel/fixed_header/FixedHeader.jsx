
import React, { useState, useEffect, useContext } from "react";
import { ViewContext } from "../Panel.jsx";
import SearchBar from "./SearchBar";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";

const FixedHeader = () => {

  const [ historyNeedsUpdating, setHistoryNeedsUpdating ] = useState(false);
  const [ history, setHistory ] = useState([]);
  const [ historyTop, setHistoryTop ] = useState(-1);
  const [ pointer, setPointer ] = useState(-1);

  const [ searchInitialState, setSearchInitialState ] = useState(
    {
      "boxContent": "",
      "dictionary": "korean",
    }
  );

  const currentView = useContext(ViewContext)["currentView"];
  const setCurrentView = useContext(ViewContext)["setCurrentView"];

  const dictionaryFromView = (viewString) => {
    if(viewString === "search_korean" || viewString === "detail_korean")
      return "korean";
    else if(viewString === "search_hanja" || viewString === "detail_hanja")
      return "hanja";
  };

  useEffect(() => {
    if(historyTop >= 0)
      setPointer(historyTop);
  }, [history]);

  useEffect(() => {
    if (pointer != -1) {
      setCurrentView(history[pointer]);
      console.log("updated view (async): ");
      console.table({history, historyTop, pointer, currentView});
      setSearchInitialState({
        "boxContent": history[pointer]["value"],
        "dictionary": dictionaryFromView(history[pointer]["view"]),
      });
    }
  }, [pointer]);

  useEffect(() => {
    const updatedHistory = [...history.slice(0, historyTop)];
    updatedHistory[historyTop] = currentView;
    setHistory(updatedHistory);
  }, [historyTop]);

  useEffect(() => {
    console.log("hnu");
    if(historyNeedsUpdating) {
      setHistoryTop(pointer + 1);
      setHistoryNeedsUpdating(false);
    }
  }, [historyNeedsUpdating]);

  return (
    <div className="fixed-header">
      <SearchBar initialState={searchInitialState} setHistoryNeedsUpdating={setHistoryNeedsUpdating} />
      <ViewHistoryNavigator pointer={pointer} setPointer={setPointer} historyTop={historyTop}/>
    </div>
  );
};

export default FixedHeader;