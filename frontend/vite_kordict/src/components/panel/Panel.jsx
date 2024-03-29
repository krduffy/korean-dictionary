
import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";

const Panel = () => {

  const [ currentView, setCurrentView ] = useState({});
  /* Values
     "view": search_korean, detail_korean, search_hanja, detail_hanja
     "value": search_term, target_code, character, etc
  */
  
  const mouseOverHanja = (character) => {
    
  };

  const clickOnHanja = (character) => {
    setCurrentView({"view": "detail_hanja", "value": character});
  }

  const clickKoreanWord = (targetCode) => {
    setCurrentView({"view": "detail_korean", "value": targetCode});
  }

  const submitSearchForm = (searchInfo) => {
    if (searchInfo["search_term"].match(/^[\u4E00-\u9FFF]$/g))
      setCurrentView({
          "view": "detail_hanja", 
          "value": searchInfo["search_term"]});
    else if (searchInfo["dictionary"] === "korean")
      setCurrentView({
          "view": "search_korean", 
          "value": searchInfo["search_term"]});
    else if (searchInfo["dictionary"] === "hanja")
      setCurrentView({
          "view": "search_hanja", 
          "value": searchInfo["search_term"]})
  }

  return (
    <>
      <SearchBar updateSearchParamsFunction={submitSearchForm} />

      {(currentView["view"] === "search_korean" || currentView["view"] === "search_hanja") 
        &&
        <PaginatedResults searchType={currentView["view"]} searchTerm={currentView["value"]}
          functions= {
            {
              "click_kor": clickKoreanWord,
              "mouse_han": mouseOverHanja,
              "click_han": clickOnHanja,
            }
          } />
      }

      {(currentView["view"] === "detail_korean" || currentView["view"] === "detail_hanja") 
        &&
          <div>
            {currentView["view"] == "detail_korean" &&
              <KoreanWordView targetCode={currentView["value"]} />
            }
            {currentView["view"] == "detail_hanja" &&
              <HanjaCharView hanjaChar={currentView["value"]} />
            }
          </div>
      }
    </>
  );
}

export default Panel;