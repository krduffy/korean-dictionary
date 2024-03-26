
import React, { useState } from "react";
import SearchBar from "./search/SearchBar.jsx";
import PaginatedResults from "./search/PaginatedResults.jsx";

const Panel = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  // search_term, search_type, dictionary
  const [ viewParams, setViewParams] = useState({"show_results": false, "show_word": false});
  // show_results, show_word

  const submitSearchForm = (searchInfo) => {
    const searchParams = {
      "search_term": searchInfo["search_term"],
      "search_type": searchInfo["search_type"],
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
    <SearchBar updateSearchParamsFunction={submitSearchForm} />

    {viewParams["show_results"] &&
      <PaginatedResults formParams={searchBarParams} />
    }
    </>
  );
}

export default Panel;