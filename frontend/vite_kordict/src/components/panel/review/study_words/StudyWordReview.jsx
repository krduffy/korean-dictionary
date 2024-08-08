import React, { useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";
import { useBackwardForwardShortcuts } from "./useBackwardForwardShortcuts.js";
import { useStudyWordReview } from "./useStudyWordReview.js";

import KoreanWordView from "../../detail_view/KoreanWordView.jsx";
import LoadErrorOrChild from "../../messages/LoadErrorOrChild.jsx.jsx";
import PageChanger from "../../paginated_results/PageChanger.jsx";
import PopupBox from "../../string_formatters/PopupBox.jsx";

const StudyWordReview = ({ initialCurrentNumber, initialSettings }) => {
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
        <>
            <div
                className="full-width flex space-children-horizontal pad-5"
                style={{
                    backgroundColor: "var(--bluepurple)",
                }}
            >
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
        </>
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
                onClick={() => setShowMenu(true)}
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

const SettingsMenu = ({ gearRef, settings, changeSetting, setShowMenu }) => {
    const gearDim = getElementSizing(gearRef);

    return (
        <PopupBox
            fromX={gearDim.centerX}
            fromY={gearDim.centerY}
            padding={gearDim.paddingX + 5}
            positioning={"fit"}
        >
            {/* Top bar with title and X to close */}
            <div className="full-width">
                <div
                    className="textcentered"
                    style={{ width: "90%", display: "inline-block" }}
                >
                    학습 설정
                </div>
                <div
                    style={{
                        cursor: "pointer",
                        width: "10%",
                        display: "inline-block",
                    }}
                    onClick={() => {
                        setShowMenu(false);
                    }}
                >
                    ✖
                </div>
            </div>

            {/* List of settings */}
            <ListOfSettings settings={settings} changeSetting={changeSetting} />
        </PopupBox>
    );
};

const ListOfSettings = ({ settings, changeSetting }) => {
    const changeShortcutSetting = (key, newValue) => {
        const newShortcutsSetting = {
            ...settings.shortcuts,
            [key]: newValue,
        };
        console.log(newShortcutsSetting);
        changeSetting("shortcuts", newShortcutsSetting);
    };

    return (
        <div>
            <div>
                <span
                    onClick={() => {
                        changeSetting("showPager", !settings.showPager);
                    }}
                >
                    {settings.showPager ? "☑" : "☐"}
                </span>
                <span>페이지 우/좌 이동기 표시</span>
            </div>

            {settings.shortcuts && (
                <div>
                    {/* Enabling shortcuts*/}
                    <div>
                        <span
                            onClick={() => {
                                changeShortcutSetting(
                                    "enable",
                                    !settings.shortcuts.enable
                                );
                            }}
                        >
                            {settings.shortcuts.enable ? "☑" : "☐"}
                        </span>
                        <span>키보드로 통해 우/좌 이동하기</span>
                    </div>

                    {/* Changing keys */}
                </div>
            )}
        </div>
    );
};
