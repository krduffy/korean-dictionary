import React from "react";
import "./styles/view-history-navigator-styles.css";

const ViewHistoryNavigator = ({
  historyPointer,
  setHistoryPointer,
  historySize,
}) => {
  const canMoveBack = () => {
    return historyPointer - 1 >= 0;
  };

  const canMoveForward = () => {
    return historyPointer + 1 <= historySize;
  };

  const back = () => {
    if (canMoveBack()) {
      setHistoryPointer(historyPointer - 1);
    }
  };

  const forward = () => {
    if (canMoveForward()) {
      setHistoryPointer(historyPointer + 1);
    }
  };

  return (
    <div className="view-history-navigator">
      <button
        className={canMoveBack() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          back();
        }}
      >
        ←
      </button>
      <button
        className={canMoveForward() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          forward();
        }}
      >
        ⇨
      </button>
    </div>
  );
};

export default ViewHistoryNavigator;
