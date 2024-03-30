
import React, { useContext } from "react";
import { EntireHistoryContext, ViewContext } from "../Panel.jsx";
import "./styles/view-history-navigator-styles.css";

const ViewHistoryNavigator = () => {

  const pointer = useContext(EntireHistoryContext)["pointer"];
  const setPointer = useContext(EntireHistoryContext)["setPointer"];
  const historyTop = useContext(EntireHistoryContext)["historyTop"];

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
    <div className="view-history-navigator">
      <button className = {canMoveBack() ? "enabled-button" : "disabled-button"} onClick = {() => { back(); }}>
      ←
      </button>
      <button className = {canMoveForward() ? "enabled-button" : "disabled-button"} onClick = {() => { forward(); }}>
      ⇨
      </button>
    </div>
  );
}

export default ViewHistoryNavigator;