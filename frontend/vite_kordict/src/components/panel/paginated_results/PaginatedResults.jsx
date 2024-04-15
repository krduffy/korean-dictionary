import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import KoreanResult from "./KoreanResult.jsx";
import HanjaResult from "./HanjaResult.jsx";
import HanjaExampleResult from "./HanjaExampleResult.jsx";
import PageChanger from "./PageChanger.jsx";
import { useAPIFetcher } from "../useAPIFetcher.js";
import { LoadingMessage } from "../../LoadingMessage.jsx";
import "./styles/results.css";

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
  const { apiFetch, loading } = useAPIFetcher();

  const updateSearchResults = () => {
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
  };

  useEffect(() => {
    updateSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (currentPage != 1) {
      /* implicitly updates results */
      setCurrentPage(1);
    } else {
      updateSearchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchType]);

  const typeAndResultsMatch = () => {
    const firstResult = searchResults["results"][0];

    /* test for existence of a field only present for specific search type */

    if (searchType === "search_korean") {
      return firstResult.kw_senses != null;
    } else if (searchType === "search_hanja") {
      return firstResult.meaning_reading != null;
    } else if (searchType === "search_hanja_examples") {
      return firstResult.kw_first_definition != null;
    }
  };

  return (
    <>
      {loading || !searchResults || !searchResults.results ? (
        <LoadingMessage />
      ) : searchResults.count === 0 ? (
        <span>결과가 없습니다.</span>
      ) : (
        typeAndResultsMatch() && (
          <div className="paginated-results">
            <span className="result-count-indicator">
              결과 {searchResults.count}건 ({10 * (currentPage - 1) + 1} -{" "}
              {Math.min(searchResults.count, currentPage * 10)})
            </span>

            {searchResults.results &&
              searchResults.results.map((result) => {
                if (searchType === "search_korean") {
                  return (
                    <KoreanResult key={result.kw_target_code} result={result} />
                  );
                } else if (searchType === "search_hanja") {
                  return <HanjaResult key={result.character} result={result} />;
                } else if (searchType === "search_hanja_examples") {
                  return (
                    <HanjaExampleResult
                      key={result.kw_target_code}
                      result={result}
                    />
                  );
                }
                return null; // Added to satisfy JSX requirement
              })}

            {/* 10 is page size */}
            {searchResults.count > 10 && (
              <PageChanger
                page={currentPage}
                hasNextPage={searchResults.next != null}
                setPageFunction={setCurrentPage}
              />
            )}
          </div>
        )
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
