import React from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";
import "./styles/panel-header-styles.css";

const PanelHeader = ({
  canNavigateBack,
  getPrecedingView,
  canNavigateForward,
  getFollowingView,
}) => {
  return (
    <div className="fixed-header">
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
