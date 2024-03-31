import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./styles/view-history-navigator-styles.css";
import { ViewContext } from "../Panel";

const ViewHistoryNavigator = ({
  canNavigateBack,
  getPrecedingView,
  canNavigateForward,
  getFollowingView,
}) => {
  const updateViewWithoutPushingToHistory =
    useContext(ViewContext)["updateViewWithoutPushingToHistory"];

  return (
    <div className="view-history-navigator">
      <button
        className={canNavigateBack() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          updateViewWithoutPushingToHistory(getPrecedingView());
        }}
      >
        ←
      </button>
      <button
        className={canNavigateForward() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          updateViewWithoutPushingToHistory(getFollowingView());
        }}
      >
        ⇨
      </button>
    </div>
  );
};

export default ViewHistoryNavigator;
