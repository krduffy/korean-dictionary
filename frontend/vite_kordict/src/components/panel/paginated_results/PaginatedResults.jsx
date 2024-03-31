import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import KoreanResult from "./KoreanResult.jsx";
import HanjaResult from "./HanjaResult.jsx";
import HanjaExampleResult from "./HanjaExampleResult.jsx";
import PageChanger from "./PageChanger.jsx";

const PaginatedResults = ({ searchType, searchTerm }) => {
  /* Below are the result types and required keys in formParms and functions (both dictionaries)
     Form params always search_term, may just switch to using a basic string
    SEARCH TYPE              FORM PARAMS              FUNCTIONS
    search_korean            "search_term"            click_kor, click_han (to be added)
    search_hanja             "search_term"            click_han
    search_hanja_examples    "search_term"            click_han (to be added)
  */

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);

  const resultsAreValid = () => {
    if (searchType === "search_korean")
      return (
        searchResults &&
        searchResults.length > 0 &&
        searchResults[0].kw_target_code
      );
    else if (searchType === "search_hanja")
      return (
        searchResults && searchResults.length > 0 && searchResults[0].character
      );
    else if (searchType == "search_hanja_examples")
      return (
        searchResults &&
        searchResults.length > 0 &&
        searchResults[0].kw_first_definition
      );
    /* Checking that >= 1 result and first result has a field no other result type has */
    return false;
  };

  const fetchFromApi = () => {
    let apiUrl;

    if (searchType === "search_korean") {
      apiUrl =
        `http://127.0.0.1:8000/api/korean_word/?` +
        `page=${currentPage}&` +
        `search_term=${searchTerm}`;
    } else if (searchType === "search_hanja") {
      apiUrl =
        `http://127.0.0.1:8000/api/hanja_char/?` +
        `page=${currentPage}&` +
        `search_term=${searchTerm}&`;
    } else if (searchType === "search_hanja_examples") {
      apiUrl =
        `http://127.0.0.1:8000/api/hanja_examples/?` +
        `page=${currentPage}&` +
        `character=${searchTerm}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.results);
        setTotalResults(data.count);
        setTotalPages(Math.ceil(data.count / 10));
      })
      .catch((error) => {
        console.error("Error while fetching results: ", error);
      });
  };

  useEffect(() => {
    if (currentPage != 1) {
      setCurrentPage(1);
    } else fetchFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType, searchTerm]);

  useEffect(() => {
    fetchFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <>
      {resultsAreValid() && (
        <div className="paginated-results">
          <span>결과 {totalResults}건</span>

          {searchType === "search_korean" &&
            searchResults.map((result) => (
              <KoreanResult key={result.kw_target_code} result={result} />
            ))}

          {searchType === "search_hanja" &&
            searchResults.map((result) => (
              <HanjaResult key={result.character} result={result} />
            ))}

          {searchType === "search_hanja_examples" &&
            searchResults.map((result) => (
              <HanjaExampleResult key={result.kw_target_code} result={result} />
            ))}

          {searchType !== "search_korean" && searchResults.length > 0 && (
            <PageChanger
              page={currentPage}
              numberOfPages={totalPages}
              setPageFunction={setCurrentPage}
            />
          )}
        </div>
      )}
    </>
  );
};

PaginatedResults.propTypes = {
  searchType: PropTypes.oneOf([
    "search_korean",
    "search_hanja",
    "search_hanja_examples",
  ]).isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export default PaginatedResults;
