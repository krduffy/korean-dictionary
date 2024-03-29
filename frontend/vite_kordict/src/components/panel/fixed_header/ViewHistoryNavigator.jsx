
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ViewContext } from "../Panel.jsx";

const ViewHistoryNavigator = ({ pointer, setPointer, historyTop }) => {

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