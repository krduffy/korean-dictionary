
import React, { useState } from "react";
import SearchBar from "./search/search_bar/SearchBar.jsx";
import PaginatedResults from "./search/listed_korean/PaginatedResults.jsx";

const Panel = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  // search_term, search_type, dictionary
  const [ viewParams, setViewParams] = useState({"show_results": false, "show_word": false});
  // show_results, show_word

  const submitSearchForm = (searchTerm) => {
    const searchParams = {
      "search_term": searchTerm,
      "search_type": "startswith",
    };
    setSearchBarParams(searchParams);

    console.log("qqqqq");
    const paramsForViewResults = {
      "show_results": true,
      "show_word": false,
    };
    setViewParams(paramsForViewResults);
  };

  return (
    <>
    <SearchBar onFormSubmit={submitSearchForm} />

    {viewParams.show_results &&
      <PaginatedResults formParams={searchBarParams} />
    }
    </>
  );
}

export default Panel;