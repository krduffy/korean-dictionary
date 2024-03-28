

import React, { useState, useEffect } from "react";
import KoreanResult from './KoreanResult.jsx' 
import HanjaResult from "./HanjaResult.jsx";
import PageChanger from './PageChanger.jsx'

const PaginatedResults = ({ formParams, functions }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchResults, setSearchResults] = useState([]);

  const resultsAreValid = (dictionary) => {
    if (dictionary == "kor")
      return searchResults && formParams["dictionary"] === "kor" && 
            searchResults.length > 0 && searchResults[0].kw_target_code;
    else if (dictionary == "han")
      return searchResults && formParams["dictionary"] === "han" && 
             searchResults.length > 0 && searchResults[0].character
  }

  useEffect(() => {
    var apiUrl;
    
    if (formParams["dictionary"] == "kor")
    {
      apiUrl = `http://127.0.0.1:8000/api/korean_word/?`+
                      `page=${currentPage}&`+
                      `search_term=${formParams["search_term"]}&`+
                      `search_type=${formParams["search_type"]}`;
    }

    else if (formParams["dictionary"] == "han")
    {
      apiUrl = `http://127.0.0.1:8000/api/hanja_char/?`+
                      `page=${currentPage}&`+
                      `search_term=${formParams["search_term"]}&`+
                      `input_language=${formParams["input_language"]}`;
    }

    console.log("in the fetch");
    console.log(apiUrl);
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      setSearchResults(data.results);
      setTotalResults(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    })
    .catch(error => {
      console.error("Error while fetching results: ", error);
    });
  }, [formParams, currentPage]);

  return (
    <div>
      <span>결과 {totalResults}</span>
      
      { resultsAreValid("kor") &&
        (
        searchResults.map((result) => (
            <KoreanResult key={result.kw_target_code} result={result} 
                          clickedKorWordFunc={functions["click_kor"]}
                          mouseOverHanFunc={functions["click_han"]}
            />
        ))
      )}
      
      { resultsAreValid("han") &&
        (
        searchResults.map((result) => (
            <HanjaResult key={result.character} result={result} />
        ))
      )}
      
      { searchResults &&
        <PageChanger page={currentPage} numberOfPages={totalPages} setPageFunction={setCurrentPage}/>
      }
    </div>
  );
}

export default PaginatedResults;