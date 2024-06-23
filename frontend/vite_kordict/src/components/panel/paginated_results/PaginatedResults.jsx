import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import PropTypes from "prop-types";

import { getTopicMarker } from "../../../../util/stringUtils.js";
import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import HanjaExampleResult from "./HanjaExampleResult.jsx";
import HanjaResult from "./HanjaResult.jsx";
import KoreanResult from "./KoreanResult.jsx";
import PageChanger from "./PageChanger.jsx";

import "./styles/results.css";

const PaginatedResults = ({ searchType, searchTerm }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchResults] = useState({});
    const { apiFetch, loading, error, response } = useAPIFetcher();
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    /* For spamproofing the results. An indicator of which request is most recent */
    const requestRef = useRef(0);

    const resultDivRef = useRef(null);
    const hasInteractedRef = useRef(false);

    const updateSearchResults = async () => {
        requestRef.current++;
        const requestNum = requestRef.current;

        let apiUrl = `api/${searchType}/`;

        /* Add parameters to certain search types */
        if (searchType === "search_korean" || searchType === "search_hanja") {
            apiUrl = apiUrl + `?page=${currentPage}&search_term=${searchTerm}`;
        } else if (searchType === "search_hanja_examples") {
            apiUrl = apiUrl + `?page=${currentPage}&character=${searchTerm}`;
        }

        const results = await apiFetch(apiUrl, authInfo["token"]);

        if (requestNum == requestRef.current) {
            setSearchResults(results);
        }
    };

    useLayoutEffect(() => {
        if (hasInteractedRef.current) {
            resultDivRef.current?.scrollIntoView({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [searchResults]);

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

    /* to force waiting for data update before rerendering on prop change */
    const typeAndResultsMatch = () => {
        const firstResult = searchResults["results"][0];

        /* test for existence of a field only present for specific search type */

        if (
            searchType === "search_korean" ||
            searchType === "known_words" ||
            searchType === "study_words"
        ) {
            return firstResult.senses != null;
        } else if (searchType === "search_hanja") {
            return firstResult.meaning_reading != null;
        } else if (searchType === "search_hanja_examples") {
            return firstResult.first_definition != null;
        }
    };

    return (
        <>
            {loading || !searchResults || !searchResults.results ? (
                <LoadingMessage />
            ) : error ? (
                <ErrorMessage errorResponse={response} />
            ) : searchResults.count === 0 ? (
                ["search_korean", "search_hanja"].includes(searchTerm) ? (
                    <span>
                        검색어 {"'"}
                        {searchTerm}
                        {"'"}
                        {getTopicMarker(searchTerm)} 결과가 없습니다.
                    </span>
                ) : (
                    <span>결과가 없습니다.</span>
                )
            ) : (
                typeAndResultsMatch() && (
                    <div className="paginated-results" ref={resultDivRef}>
                        <span className="result-count-indicator">
                            결과 {searchResults.count}건 (
                            {10 * (currentPage - 1) + 1} -{" "}
                            {Math.min(searchResults.count, currentPage * 10)})
                        </span>

                        {searchResults.results &&
                            searchResults.results.map((result, id) => {
                                if (
                                    searchType === "search_korean" ||
                                    searchType === "known_words" ||
                                    searchType === "study_words"
                                ) {
                                    return (
                                        <KoreanResult
                                            key={id}
                                            result={result}
                                        />
                                    );
                                } else if (searchType === "search_hanja") {
                                    return (
                                        <HanjaResult key={id} result={result} />
                                    );
                                } else if (
                                    searchType === "search_hanja_examples"
                                ) {
                                    return (
                                        <HanjaExampleResult
                                            key={id}
                                            result={result}
                                        />
                                    );
                                }
                            })}

                        {/* 10 is page size */}
                        {searchResults.count > 10 && (
                            <PageChanger
                                page={currentPage}
                                hasNextPage={searchResults.next != null}
                                setPageFunction={setCurrentPage}
                                hasInteractedRef={hasInteractedRef}
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
