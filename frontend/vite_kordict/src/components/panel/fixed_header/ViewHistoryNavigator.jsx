import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./styles/fixed-header-styles.css";
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
        className={
          canNavigateBack()
            ? "enabled-navigation-button"
            : "disabled-navigation-button"
        }
        onClick={() => {
          if (canNavigateBack()) {
            updateViewWithoutPushingToHistory(getPrecedingView());
          }
        }}
      >
        {canNavigateBack() ? "◀" : "◁"}
      </button>
      <button
        className={
          canNavigateForward()
            ? "enabled-navigation-button"
            : "disabled-navigation-button"
        }
        onClick={() => {
          if (canNavigateForward()) {
            updateViewWithoutPushingToHistory(getFollowingView());
          }
        }}
      >
        {canNavigateForward() ? "▶" : "▷"}
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
