import React from "react";

import PropTypes from "prop-types";

import { getTopicMarker } from "../../../../util/stringUtils.js";

import ErrorMessage from "../messages/ErrorMessage.jsx";
import LoadErrorOrChild from "../messages/LoadErrorOrChild.jsx.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import PageChanger from "./PageChanger.jsx";
import { usePaginatedResults } from "./usePaginatedResults.jsx";

import "./styles/results.css";

const PaginatedResults = ({
    searchType,
    searchTerm,
    initialPage,
    nestLevel,
    setNumResults,
}) => {
    const {
        currentPage,
        setCurrentPage,
        searchResults,
        loading,
        error,
        response,
        typeAndResultsMatch,
        getResultComponent,
        resultDivRef,
        hasInteractedRef,
    } = usePaginatedResults(searchType, searchTerm, initialPage, setNumResults);

    return (
        <LoadErrorOrChild loading={loading} error={error} response={response}>
            {searchResults?.count === 0 ? (
                <NoResultsMessage
                    searchType={searchType}
                    searchTerm={searchTerm}
                />
            ) : (
                searchResults?.results &&
                typeAndResultsMatch() && (
                    <div className="paginated-results" ref={resultDivRef}>
                        <div className="result-count-indicator">
                            결과 {searchResults.count}건 (
                            {10 * (currentPage - 1) + 1} -{" "}
                            {Math.min(searchResults.count, currentPage * 10)})
                        </div>

                        {searchResults.results && (
                            <ResultsList
                                results={searchResults.results}
                                nestLevel={nestLevel}
                                getResultComponent={getResultComponent}
                            />
                        )}

                        {/* 10 is page size */}
                        {searchResults.count > 10 && (
                            <PageChanger
                                page={currentPage}
                                numPages={Math.ceil(searchResults.count / 10)}
                                setPageFunction={setCurrentPage}
                                hasInteractedRef={hasInteractedRef}
                            />
                        )}
                    </div>
                )
            )}
        </LoadErrorOrChild>
    );
};

PaginatedResults.propTypes = {
    searchType: PropTypes.oneOf([
        "search_korean",
        "search_hanja",
        "search_hanja_examples",
        "user_known_words",
        "user_study_words",
    ]).isRequired,
    searchTerm: PropTypes.string.isRequired,
};

export default PaginatedResults;

const NoResultsMessage = ({ searchType, searchTerm }) => {
    return ["search_korean", "search_hanja"].includes(searchType) ? (
        <div className="no-results-indicator">
            검색어 {"'"}
            {searchTerm}
            {"'"}
            {getTopicMarker(searchTerm)} 결과가 없습니다.
        </div>
    ) : (
        <div className="no-results-indicator">결과가 없습니다.</div>
    );
};

const ResultsList = ({ results, nestLevel, getResultComponent }) => {
    return results.map((result, id) => {
        if (nestLevel) {
            return (
                <div
                    key={id}
                    className={`curved-box-nest${nestLevel} pad-10 tbmargin-10`}
                >
                    {getResultComponent(result)}
                </div>
            );
        } else {
            return (
                <div key={id} className="curved-box pad-10 tbmargin-10">
                    {getResultComponent(result)}
                </div>
            );
        }
    });
};
