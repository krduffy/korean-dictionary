
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import ViewHistoryNavigator from "./ViewHistoryNavigator.jsx";

const FixedHeader = () => {

  const [ historyNeedsUpdating, setHistoryNeedsUpdating ] = useState(false);

  return (
    <div className="fixed-header">
      <SearchBar setHistoryNeedsUpdating={setHistoryNeedsUpdating} />
      <ViewHistoryNavigator historyNeedsUpdating={historyNeedsUpdating} 
                            setHistoryNeedsUpdating={setHistoryNeedsUpdating}/>
    </div>
  );
};

export default FixedHeader;