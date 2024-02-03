

import React, { useState, useEffect } from "react";
import SearchResult from './SearchResult.jsx'
import './styles.css' 

const PaginatedResults = ({ formParams }) => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("startswith");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchResults, setSearchResults] = useState([]);

  const getFromApi = () => {
    console.log("GET FROM API")
    const apiUrl = `http://127.0.0.1:8000/api/korean_word/?page=${currentPage}&`+
                                                          `search_term=${searchTerm}&`+
                                                          `search_type=${searchType}`;
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
  };

  useEffect(() => {
    setSearchTerm(prevSearchTerm => formParams["search_term"]);
    setSearchType(prevSearchType => formParams["search_type"]);
  }, [formParams]);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:8000/api/korean_word/?page=${currentPage}&`+
    `search_term=${searchTerm}&`+
    `search_type=${searchType}`;
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
  }, [searchTerm, searchType, currentPage]);

  return (
    <div>
      <span>결과 {totalResults}</span>
      { searchResults && (
        searchResults.map((result) => (
          <SearchResult key={result.kw_target_code} result={result} />
        ))
      )}
    </div>
  );
}

export default PaginatedResults;