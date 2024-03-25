
import React, { useState } from "react";
import SearchBar from "./search/search_bar/SearchBar.jsx";
import PaginatedResults from "./search/listed_korean/PaginatedResults.jsx";

const Panel = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  
  const submitSearchForm = (searchTerm) => {
    const params = {
      "search_term": searchTerm,
      "search_type": "startswith",
    };
    setSearchBarParams(params);
  };

  return (
    <>
    <SearchBar onFormSubmit={submitSearchForm} />
    <PaginatedResults formParams={searchBarParams} />
    </>
  );
}

export default Panel;