
import React from "react";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";
import "./styles/panel-header-styles.css";

const FixedHeader = () => {

  return (
    <div className="fixed-header">
      <SearchBar />
      <ViewHistoryNavigator />
    </div>
  );
};

export default FixedHeader;