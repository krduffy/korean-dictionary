import React from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";
import "./styles/panel-header-styles.css";

const FixedHeader = ({
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

export default FixedHeader;
