
import React, { useState, useContext, createContext } from "react";
import SearchBar from "./SearchBar.jsx";
import PaginatedResults from "./paginated_results/PaginatedResults.jsx";
import KoreanWordView from "./detail_view/KoreanWordView.jsx";
import HanjaCharView from "./detail_view/HanjaCharView.jsx";

export const SetViewFunctionContext = createContext(null);

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

  return (
    <SetViewFunctionContext.Provider value={setCurrentView}>
      <SearchBar />

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
    </SetViewFunctionContext.Provider>
  );
}

export default Panel;