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
          if (canNavigateBack()) {
            updateViewWithoutPushingToHistory(getPrecedingView());
          }
        }}
      >
        ←
      </button>
      <button
        className={canNavigateForward() ? "enabled-button" : "disabled-button"}
        onClick={() => {
          if (canNavigateForward()) {
            updateViewWithoutPushingToHistory(getFollowingView());
          }
        }}
      >
        ⇨
      </button>
    </div>
  );
};

ViewHistoryNavigator.propTypes = {
  canNavigateBack: PropTypes.func.isRequired,
  getPrecedingView: PropTypes.func.isRequired,
  canNavigateForward: PropTypes.func.isRequired,
  getFollowingView: PropTypes.func.isRequired,
};

export default ViewHistoryNavigator;
