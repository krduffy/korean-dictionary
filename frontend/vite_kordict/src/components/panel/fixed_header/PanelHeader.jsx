import React from "react";
import PropTypes from "prop-types";
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

FixedHeader.propTypes = {
  historyPointer: PropTypes.number.isRequired, // History pointer prop type
  setHistoryPointer: PropTypes.func.isRequired, // History pointer setter prop type
  historySize: PropTypes.number.isRequired, // History size prop type
  searchBarInitialState: PropTypes.shape({
    boxContent: PropTypes.string.isRequired,
    dictionary: PropTypes.string.isRequired,
  }).isRequired, // Search bar initial state prop type
};

export default FixedHeader;
