import React from "react";
import PropTypes from "prop-types";
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

ViewHistoryNavigator.propTypes = {
  historyPointer: PropTypes.number.isRequired, // History pointer prop type
  setHistoryPointer: PropTypes.func.isRequired, // History pointer setter prop type
  historySize: PropTypes.number.isRequired, // History size prop type
};

export default ViewHistoryNavigator;
