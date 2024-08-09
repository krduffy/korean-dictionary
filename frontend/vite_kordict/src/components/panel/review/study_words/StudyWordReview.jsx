import React, { useRef, useState } from "react";

import { useBackwardForwardShortcuts } from "./useBackwardForwardShortcuts.js";
import { useStudyWordReview } from "./useStudyWordReview.js";

import KoreanWordView from "../../detail_view/KoreanWordView.jsx";
import LoadErrorOrChild from "../../messages/LoadErrorOrChild.jsx.jsx";
import PageChanger from "../../paginated_results/PageChanger.jsx";
import SettingsMenu from "./SettingsMenu.jsx";

const StudyWordReview = ({ seed, initialCurrentNumber, initialSettings }) => {
    const {
        loading,
        error,
        response,
        currentNumber,
        numWords,
        setCurrentNumber,
        currentTargetCode,
        settings,
        changeSetting,
    } = useStudyWordReview({
        seed: seed,
        initialCurrentNumber: initialCurrentNumber,
        initialSettings: initialSettings,
    });

    return (
        <div>
            {/* Actual word */}
            <TopInfoBar
                currentNumber={currentNumber}
                numWords={numWords}
                setCurrentNumber={setCurrentNumber}
                settings={settings}
                changeSetting={changeSetting}
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
    changeSetting,
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
        <div
            className="pad-10 curved-box-shape"
            style={{
                marginBottom: "20px",
                border: "1px gray solid",
                backgroundColor: "var(--bluepurple)",
            }}
        >
            <div className="full-width flex space-children-horizontal">
                <div
                    className="textcentered"
                    style={{
                        position: "relative",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "inline-block",
                        fontSize: "20px",
                    }}
                >
                    암기장 단어 학습
                </div>
                <div
                    className="textcentered"
                    style={{
                        position: "relative",
                        right: "0px",
                        display: "inline-block",
                    }}
                >
                    <SettingsGear
                        settings={settings}
                        changeSetting={changeSetting}
                    />
                </div>
            </div>
            {settings.showPager && (
                <PageChanger
                    page={currentNumber}
                    numPages={numWords}
                    setPageFunction={setCurrentNumber}
                />
            )}
        </div>
    );
};

const SettingsGear = ({ settings, changeSetting }) => {
    const gearRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <span
                title="학습 설정 보기"
                className="pointer"
                ref={gearRef}
                onClick={() => setShowMenu(!showMenu)}
            >
                ⚙️
            </span>
            {showMenu && (
                <SettingsMenu
                    gearRef={gearRef}
                    settings={settings}
                    changeSetting={changeSetting}
                    setShowMenu={setShowMenu}
                />
            )}
        </>
    );
};
