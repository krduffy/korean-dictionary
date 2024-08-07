import React from "react";

import { useBackwardForwardShortcuts } from "./useBackwardForwardShortcuts.js";
import { useStudyWordReview } from "./useStudyWordReview.js";

import KoreanWordView from "../../detail_view/KoreanWordView.jsx";
import LoadErrorOrChild from "../../messages/LoadErrorOrChild.jsx.jsx";
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
        settings,
        changeSetting,
    } = useStudyWordReview({
        initialSettings: {
            shortcuts: {
                enable: true,
                backKey: "ArrowLeft",
                forwardKey: "ArrowRight",
            },
        },
    });

    return (
        <div>
            {/* Actual word */}
            <TopInfoBar
                currentNumber={currentNumber}
                numWords={numWords}
                setCurrentNumber={setCurrentNumber}
                settings={settings}
            />

            <LoadErrorOrChild
                loading={loading}
                error={error}
                response={response}
            >
                {currentTargetCode && (
                    <KoreanWordView targetCode={currentTargetCode} />
                )}
            </LoadErrorOrChild>
        </div>
    );
};

export default StudyWordReview;

const TopInfoBar = ({
    currentNumber,
    numWords,
    setCurrentNumber,
    settings,
}) => {
    useBackwardForwardShortcuts(
        settings.shortcuts?.enable,
        settings.shortcuts?.backKey,
        settings.shortcuts?.forwardKey,
        currentNumber,
        setCurrentNumber,
        numWords
    );

    return (
        <>
            <PageChanger
                page={currentNumber}
                numPages={numWords}
                setPageFunction={setCurrentNumber}
            />
        </>
    );
};
