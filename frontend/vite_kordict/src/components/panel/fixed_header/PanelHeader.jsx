import React from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";
import "./styles/panel-header-styles.css";

const FixedHeader = ({
  canNavigateBack,
  navigateBack,
  canNavigateForward,
  navigateForward,
}) => {
  return (
    <div className="fixed-header">
      <SearchBar />
      <ViewHistoryNavigator
        canNavigateBack={canNavigateBack}
        navigateBack={navigateBack}
        canNavigateForward={canNavigateForward}
        navigateForward={navigateForward}
      />
    </div>
  );
};

export default FixedHeader;
