
import React, { useState } from "react";
import SearchBar from "./search_bar/SearchBar.jsx";
import PaginatedResults from "./listed_korean/PaginatedResults.jsx";

const SearchPage = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  
  const submitSearchForm = (searchTerm) => {
    const params = {
      "search_term": searchTerm,
      "search_type": "startswith",
    };
    setSearchBarParams(params);
    console.log("Just finished setting")
  };

  return (
    <>
    <span> {searchBarParams["search_term"]}</span>
    <SearchBar onFormSubmit={submitSearchForm} />
    <PaginatedResults formParams={searchBarParams} />
    </>
  );
}

export default SearchPage;