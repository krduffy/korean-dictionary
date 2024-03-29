

import React, { useState, useEffect } from "react";
import KoreanResult from './KoreanResult.jsx' 
import HanjaResult from "./HanjaResult.jsx";
import HanjaExampleResult from "./HanjaExampleResult.jsx";
import PageChanger from './PageChanger.jsx'

const PaginatedResults = ({ formParams, functions }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchResults, setSearchResults] = useState([]);

  const resultsAreValid = (resultType) => {
    if (resultType == "kor")
      return searchResults && formParams["dictionary"] === "kor" && 
            searchResults.length > 0 && searchResults[0].kw_target_code;
    else if (resultType == "han")
      return searchResults && formParams["dictionary"] === "han" && 
             searchResults.length > 0 && searchResults[0].character
    else if (resultType == "examples")
      return searchResults && formParams["dictionary"] === "han" && 
             searchResults.length > 0 && searchResults[0].kw_first_definition
    else if (resultType == "any")
      return resultsAreValid("kor") || resultsAreValid("han") || resultsAreValid("examples");
  }

  const fetchFromApi = () => {
    let apiUrl;
    console.log(formParams);

    if (formParams["dictionary"] == "kor")
    {
      apiUrl = `http://127.0.0.1:8000/api/korean_word/?`+
                      `page=${currentPage}&`+
                      `search_term=${formParams["search_term"]}`;
    }

    else if (formParams["dictionary"] == "han" && !formParams["get_hanja_examples"])
    {
      apiUrl = `http://127.0.0.1:8000/api/hanja_char/?`+
                      `page=${currentPage}&`+
                      `search_term=${formParams["search_term"]}&`+
                      `input_language=${formParams["input_language"]}`;
    }

    else if (formParams["get_hanja_examples"])
    {
      apiUrl = `http://127.0.0.1:8000/api/hanja_examples/?`+
                      `page=${currentPage}&`+
                      `character=${formParams["character"]}`;
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
  }

  useEffect(() => {
    console.log("form change");
    if(currentPage != 1)
    {
      console.log("page wasnt 1")
      setCurrentPage(1);
    }
    else
      fetchFromApi();
  }, [formParams]);

  useEffect(() => {
    console.log("page change");
    fetchFromApi();
  }, [currentPage]);

  return (
    <div>
      <span>결과 {totalResults}</span>
      
      { resultsAreValid("kor") &&
        (
        searchResults.map((result) => (
            <KoreanResult key={result.kw_target_code} result={result} 
                          clickedKorWordFunc={functions["click_kor"]}
                          mouseOverHanFunc={functions["mouse_han"]}
            />
        ))
      )}
      
      { resultsAreValid("han") &&
        (
        searchResults.map((result) => (
            <HanjaResult key={result.character} result={result} clickFunction={functions["click_han"]}/>
        ))
      )}

      { resultsAreValid("examples") &&
        (
        searchResults.map((result) => (
          <HanjaExampleResult key={result.kw_target_code} result={result} />
        ))
      )}
      
      { searchResults &&
        <PageChanger page={currentPage} numberOfPages={totalPages} setPageFunction={setCurrentPage}/>
      }
    </div>
  );
}

export default PaginatedResults;