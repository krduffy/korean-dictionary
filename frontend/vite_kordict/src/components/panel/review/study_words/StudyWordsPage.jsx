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
            <button onClick={handleReviewButtonClick}>go to review</button>
            <PaginatedResults
                searchType={"user_study_words"}
                searchTerm={""}
                initialPage={initialPage}
            />
        </>
    );
};

export default StudyWordsPage;
