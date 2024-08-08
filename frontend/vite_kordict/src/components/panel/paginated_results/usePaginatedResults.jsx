import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { useDebounce } from "../../../hooks/useDebounce.js";
import { useSpamProtectedSetter } from "../../../hooks/useSpamProtectedSetter.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import HanjaExampleResult from "./HanjaExampleResult.jsx";
import HanjaResult from "./HanjaResult.jsx";
import KoreanResult from "./KoreanResult.jsx";

export const usePaginatedResults = (searchType, searchTerm, initialPage) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchResults, setSearchResults] = useState({});
    const { apiFetch, loading, error, response } = useAPIFetcher();

    const viewContext = useContext(ViewContext);
    const currentView = viewContext["currentView"];
    const updateCurrentViewInHistory =
        viewContext["updateCurrentViewInHistory"];

    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const resultDivRef = useRef(null);
    const hasInteractedRef = useRef(false);

    const asyncGetResults = async () => {
        let apiUrl = `api/${searchType}/?page=${currentPage}`;

        /* Add parameters to certain search types */
        if (searchType === "search_korean" || searchType === "search_hanja") {
            apiUrl = apiUrl + `&search_term=${searchTerm}`;
        } else if (searchType === "search_hanja_examples") {
            apiUrl = apiUrl + `&character=${searchTerm}`;
        }

        const data = await apiFetch(apiUrl, authInfo["token"]);
        return data;
    };

    const updateSearchResults = useDebounce(
        useSpamProtectedSetter({
            dataGetter: asyncGetResults,
            setter: setSearchResults,
        })
    );

    useLayoutEffect(() => {
        if (hasInteractedRef.current) {
            resultDivRef.current?.scrollIntoView({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [JSON.stringify(searchResults)]);

    useEffect(() => {
        updateSearchResults();

        /* */
        const newView = {
            view: currentView.view,
            value: {
                ...currentView.value,
                initial_page: currentPage,
            },
            searchBarInitialState: currentView.searchBarInitialState,
        };

        updateCurrentViewInHistory(newView);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        if (initialPage !== currentPage) {
            setCurrentPage(initialPage);
        } else {
            updateSearchResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, searchType, initialPage]);

    useEffect(() => {
        if (currentPage !== initialPage) {
            updateSearchResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    /* to force waiting for data update before rerendering on prop change */
    const typeAndResultsMatch = () => {
        const firstResult = searchResults["results"][0];

        /* test for existence of a field only present for specific search type */

        if (
            searchType === "search_korean" ||
            searchType === "user_known_words" ||
            searchType === "user_study_words"
        ) {
            return firstResult.senses != null;
        } else if (searchType === "search_hanja") {
            return firstResult.meaning_reading != null;
        } else if (searchType === "search_hanja_examples") {
            return firstResult.first_definition != null;
        }
    };

    const getResultComponent = (result) => {
        if (
            searchType === "search_korean" ||
            searchType === "user_known_words" ||
            searchType === "user_study_words"
        ) {
            return <KoreanResult result={result} />;
        } else if (searchType === "search_hanja") {
            return <HanjaResult result={result} />;
        } else if (searchType === "search_hanja_examples") {
            return <HanjaExampleResult result={result} />;
        }
    };

    return {
        currentPage,
        setCurrentPage,
        searchResults,
        updateSearchResults,
        loading,
        error,
        response,
        typeAndResultsMatch,
        getResultComponent,
        resultDivRef,
        hasInteractedRef,
    };
};
