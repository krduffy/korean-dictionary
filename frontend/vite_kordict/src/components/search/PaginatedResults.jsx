

import React, { useState, useEffect } from "react";
import KoreanResult from './KoreanResult.jsx' 
import PageChanger from './PageChanger.jsx'

const PaginatedResults = ({ formParams, functions }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:8000/api/korean_word/?`+
                    `page=${currentPage}&`+
                    `search_term=${formParams["search_term"]}&`+
                    `search_type=${formParams["search_type"]}`;
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
      { searchResults && formParams["dictionary"] === "kor" && (
        searchResults.map((result) => (
            <KoreanResult key={result.kw_target_code} result={result} 
                          clickedKorWordFunc={functions["click_kor"]}
                          mouseOverHanFunc={functions["click_han"]}
            />
        ))
      )}
      { searchResults && formParams["dictionary"] === "han" && (
        searchResults.map((result) => (
            <HanjaResult key={result.kw_target_code} result={result} />
        ))
      )}
      <PageChanger page={currentPage} numberOfPages={totalPages} setPageFunction={setCurrentPage}/>
    </div>
  );
}

export default PaginatedResults;