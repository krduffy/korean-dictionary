import React, { useContext, useState } from "react";

import { getNewReviewView } from "../../../../../util/viewUtils.js";

import { ViewContext } from "../../Panel.jsx";
import PaginatedResults from "../../paginated_results/PaginatedResults.jsx";

import "./study-styles.css";

const StudyWordsPage = ({ initialPage }) => {
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];
    const [numResults, setNumResults] = useState(0);

    const handleReviewButtonClick = () => {
        updateViewAndPushToHistory(getNewReviewView());
    };

    return (
        <>
            {numResults > 0 && (
                <button
                    onClick={handleReviewButtonClick}
                    className="go-to-study-button"
                >
                    학습
                </button>
            )}
            <PaginatedResults
                searchType={"user_study_words"}
                searchTerm={""} /* not used for searchType user_study_words */
                initialPage={initialPage}
                setNumResults={setNumResults}
            />
        </>
    );
};

export default StudyWordsPage;
