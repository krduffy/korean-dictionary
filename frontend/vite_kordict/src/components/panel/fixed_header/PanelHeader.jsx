import React, { useContext } from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";
import "./styles/panel-header-styles.css";
import { ViewContext } from "../Panel.jsx";

const PanelHeader = ({
  canNavigateBack,
  getPrecedingView,
  canNavigateForward,
  getFollowingView,
}) => {
  const currentView = useContext(ViewContext)["currentView"];
  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];

  return (
    <div className="fixed-header">
      <button
        onClick={() => {
          if (currentView.view !== "add_word") {
            updateViewAndPushToHistory({
              view: "add_word",
              value: 0,
              searchBarInitialState: {
                boxContent: "",
                dictionary: "korean",
              },
            });
          }
        }}
      >
        단어 추가
      </button>

      <SearchBar />
      <ViewHistoryNavigator
        canNavigateBack={canNavigateBack}
        getPrecedingView={getPrecedingView}
        canNavigateForward={canNavigateForward}
        getFollowingView={getFollowingView}
      />
    </div>
  );
};

PanelHeader.propTypes = {
  canNavigateBack: PropTypes.func.isRequired,
  getPrecedingView: PropTypes.func.isRequired,
  canNavigateForward: PropTypes.func.isRequired,
  getFollowingView: PropTypes.func.isRequired,
};

export default PanelHeader;
