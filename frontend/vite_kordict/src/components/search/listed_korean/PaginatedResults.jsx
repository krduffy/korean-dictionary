

import React, { useState, useEffect } from "react";
import SearchResult from './SearchResult.jsx'

const PaginatedResults = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Gets search results from api
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/korean_word/?search_term=%EA%B0%84%EB%8B%A8&search_type=startswith")
    .then(response => response.json())
    .then(data => {
      setSearchResults(data.results);
      setTotalResults(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    })
    .catch(error => {
      console.error("Error while fetching results: ", error);
    });
  }, [currentPage]);

  return (
    <div>
      <h1> Search results </h1>
      { searchResults && (
        searchResults.map((result) => (
          <SearchResult key={result.kw_target_code} result={result} />
        ))
      )}
    </div>
  );
}

export default PaginatedResults;