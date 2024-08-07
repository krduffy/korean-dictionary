import React, { useContext } from "react";

import { getNewReviewView } from "../../../../../util/viewUtils.js";

import { ViewContext } from "../../Panel.jsx";
import PaginatedResults from "../../paginated_results/PaginatedResults.jsx";

const StudyWordsPage = ({ initialPage }) => {
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];

    const handleReviewButtonClick = () => {
        updateViewAndPushToHistory(getNewReviewView());
    };

    return (
        <>
            <button onClick={handleReviewButtonClick}>학습</button>
            <PaginatedResults
                searchType={"user_study_words"}
                searchTerm={""} /* not used for searchType user_study_words */
                initialPage={initialPage}
            />
        </>
    );
};

export default StudyWordsPage;
