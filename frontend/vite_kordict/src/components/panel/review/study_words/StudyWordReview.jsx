import React from "react";

import { useStudyWordReview } from "./useStudyWordReview.js";

import KoreanWordView from "../../detail_view/KoreanWordView.jsx";
import PageChanger from "../../paginated_results/PageChanger.jsx";

const StudyWordReview = () => {
    const {
        loading,
        successful,
        error,
        response,
        currentNumber,
        numWords,
        setCurrentNumber,
        currentTargetCode,
    } = useStudyWordReview();

    return (
        <div>
            {/* Actual word */}
            <PageChanger
                page={currentNumber}
                numPages={numWords}
                setPageFunction={setCurrentNumber}
            />
            <KoreanWordView targetCode={currentTargetCode} />
        </div>
    );
};

export default StudyWordReview;
