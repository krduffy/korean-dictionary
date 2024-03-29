
import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";

const Panel = () => {

  const [ searchBarParams, setSearchBarParams ] = useState({});
  // search_term, (*search_type), dictionary, (*input_language)
  const [ viewParams, setViewParams] = useState({"show_results": false, "show_word": false});
  // show_results, show_word
  const [ wordInViewTargetCode, setWordInViewTargetCode ] = useState();

  const [ hanjaInView, setHanjaInView ] = useState();
  
  const mouseOverHanja = (character) => {
    
  };

  const clickOnHanja = (character) => {
    setHanjaInView(character);

    setViewParams({
      "show_results": false,
      "show_word": true,
    })
  }

  const clickKoreanWord = (targetCode) => {

    setWordInViewTargetCode(targetCode);

    setViewParams({
      "show_results": false,
      "show_word": true,
    });
  }

  const submitSearchForm = (searchInfo) => {
    console.log(searchInfo);
    setSearchBarParams(searchInfo);

    console.log(searchBarParams);
    if(searchInfo["input_language"] == "han" && searchInfo["search_term"].length == 1)
    {
      console.log(1);
      setHanjaInView(searchInfo["search_term"]);
      setViewParams({
        "show_results": false,
        "show_word": true,
      });
    }

    else
    {
      console.log(2);
      setViewParams({
        "show_results": true,
        "show_word": false,
      });
    }
  };

  return (
    <>
      <SearchBar updateSearchParamsFunction={submitSearchForm} />

      {viewParams["show_results"] &&
        <PaginatedResults formParams={searchBarParams} functions={
          {
            "click_kor": clickKoreanWord,
            "mouse_han": mouseOverHanja,
            "click_han": clickOnHanja,
          }
        } />
      }

      {viewParams["show_word"] &&
      <div>
        {searchBarParams["dictionary"] == "kor" &&
          <KoreanWordView targetCode={wordInViewTargetCode} />
        }
        {searchBarParams["dictionary"] == "han" &&
          <HanjaCharView hanjaChar={hanjaInView} />
        }
      </div>
      }
    </>
  );
}

export default Panel;