
import React, { useState } from "react";
import SearchBar from "./search/SearchBar.jsx";
import PaginatedResults from "./search/PaginatedResults.jsx";

const Panel = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  // search_term, search_type, dictionary
  const [ viewParams, setViewParams] = useState({"show_results": false, "show_word": false});
  // show_results, show_word
  
  const mouseOverHanja = (character) => {
    
  };

  const clickKoreanWord = (targetCode) => {
    console.log(targetCode);
  }

  const submitSearchForm = (searchInfo) => {
    const searchParams = {
      "search_term": searchInfo["search_term"],
      "search_type": searchInfo["search_type"],
      "dictionary": searchInfo["dictionary"],
    };
    console.log(searchParams);
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
      <PaginatedResults formParams={searchBarParams} functions={
        {
          "click_kor": clickKoreanWord,
          "click_han": mouseOverHanja,
        }
      } />
    }
    </>
  );
}

export default Panel;