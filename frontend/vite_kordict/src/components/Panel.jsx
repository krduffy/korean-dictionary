
import React, { useState } from "react";
import SearchBar from "./search/SearchBar.jsx";
import PaginatedResults from "./search/PaginatedResults.jsx";
import KoreanWordView from "./view/KoreanWordView.jsx";

const Panel = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  // search_term, search_type, dictionary
  const [ viewParams, setViewParams] = useState({"show_results": false, "show_word": false});
  // show_results, show_word
  const [ wordInViewTargetCode, setWordInViewTargetCode ] = useState();
  
  const mouseOverHanja = (character) => {
    
  };

  const clickKoreanWord = (targetCode) => {

    setWordInViewTargetCode(targetCode);

    setViewParams({
      "show_results": false,
      "show_word": true,
    });
  }

  const submitSearchForm = (searchInfo) => {
    
    setSearchBarParams(searchInfo);

    setViewParams({
      "show_results": true,
      "show_word": false,
    });
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

      {viewParams["show_word"] &&
        <KoreanWordView targetCode={wordInViewTargetCode} />
      }
    </>
  );
}

export default Panel;