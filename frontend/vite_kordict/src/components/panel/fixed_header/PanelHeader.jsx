import React from "react";
import SearchBar from "./SearchBar.jsx";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";
import "./styles/panel-header-styles.css";

const FixedHeader = ({
  historyPointer,
  setHistoryPointer,
  historySize,
  searchBarInitialState,
}) => {
  return (
    <div className="fixed-header">
      <SearchBar searchBarInitialState={searchBarInitialState} />
      <ViewHistoryNavigator
        historyPointer={historyPointer}
        setHistoryPointer={setHistoryPointer}
        historySize={historySize}
      />
    </div>
  );
};

export default FixedHeader;
