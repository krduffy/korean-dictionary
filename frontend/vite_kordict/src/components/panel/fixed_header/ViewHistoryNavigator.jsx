import React from "react";
import PropTypes from "prop-types";
import "./styles/view-history-navigator-styles.css";

const ViewHistoryNavigator = ({
  canNavigateBack,
  navigateBack,
  canNavigateForward,
  navigateForward,
}) => {
  return (
    <div className="view-history-navigator">
      <button
        className={canNavigateBack() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          navigateBack();
        }}
      >
        ←
      </button>
      <button
        className={canNavigateForward() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          navigateForward();
        }}
      >
        ⇨
      </button>
    </div>
  );
};

export default ViewHistoryNavigator;
