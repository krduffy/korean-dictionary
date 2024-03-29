
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ViewContext } from "../Panel.jsx";

const ViewHistoryNavigator = ({ historyNeedsUpdating, setHistoryNeedsUpdating }) => {

  const [ history, setHistory ] = useState([]);
  const [ historyTop, setHistoryTop ] = useState(-1);
  const [ pointer, setPointer ] = useState(-1);

  const currentView = useContext(ViewContext)["currentView"];
  const setCurrentView = useContext(ViewContext)["setCurrentView"];

  useEffect(() => {
    if(historyTop >= 0)
      setPointer(historyTop);
  }, [history]);

  useEffect(() => {
    if (pointer != -1) {
      setCurrentView(history[pointer]);
      console.log("updated view (async): ");
      console.table({history, historyTop, pointer, currentView});
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

  const canMoveBack = () => {
    return pointer - 1 >= 0;
  };

  const canMoveForward = () => {
    return pointer + 1 < historySize;
  };

  const back = () => {
    if(canMoveBack()) {
      setPointer(pointer - 1);
    }
  }

  const forward = () => {
    if(canMoveForward()) {
      setPointer(pointer + 1);
    }
  }

  return (
    <div>
      <button onClick = {() => { back(); }}>
        back
      </button>
      <button onClick = {() => { forward(); }}>
        forward
      </button>
    </div>
  );
}

export default ViewHistoryNavigator;