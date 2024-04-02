import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import KoreanResult from "./KoreanResult.jsx";
import HanjaResult from "./HanjaResult.jsx";
import HanjaExampleResult from "./HanjaExampleResult.jsx";
import PageChanger from "./PageChanger.jsx";
import { useAPIFetcher } from "../useAPIFetcher.js";
import { LoadingMessage } from "../../LoadingMessage.jsx";

const PaginatedResults = ({ searchType, searchTerm }) => {
  /* Below are the result types and required keys in formParms and functions (both dictionaries)
     Form params always search_term, may just switch to using a basic string
    SEARCH TYPE              FORM PARAMS              FUNCTIONS
    search_korean            "search_term"            click_kor, click_han (to be added)
    search_hanja             "search_term"            click_han
    search_hanja_examples    "search_term"            click_han (to be added)
  */

  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState({});
  const { apiFetch, loading, error } = useAPIFetcher();

  useEffect(() => {
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

    apiFetch(apiUrl, setSearchResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType, searchTerm, currentPage]);

  return (
    <>
      {loading || !searchResults || !searchResults.results ? (
        <LoadingMessage />
      ) : (
        <div className="paginated-results">
          <span>결과 {searchResults["count"]}건</span>
          <span>{searchResults.results == null}</span>
          {searchType === "search_korean" &&
            searchResults["results"].map((result) => (
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
              numberOfPages={Math.ceil(searchResults["results"] / 10)}
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
