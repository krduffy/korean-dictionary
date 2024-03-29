
import React, { useContext } from "react";
import { EntireHistoryContext, ViewContext } from "../Panel.jsx";

const ViewHistoryNavigator = () => {

  const pointer = useContext(EntireHistoryContext)["pointer"];
  const setPointer = useContext(EntireHistoryContext)["setPointer"];
  const historyTop = useContext(EntireHistoryContext)["historyTop"];

  const setView = useContext(ViewContext)["setCurrentView"];

  const canMoveBack = () => {
    return pointer - 1 >= 0;
  };

  const canMoveForward = () => {
    return pointer + 1 <= historyTop;
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