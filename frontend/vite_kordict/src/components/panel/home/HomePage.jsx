import React, { useContext, useEffect, useRef, useState } from "react";

import {
    getBasicUnknownWordsView,
    getNewStudyWordView,
} from "../../../../util/viewUtils.js";
import { HANJA_GAME_LENGTH } from "../../../constants.js";
import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import HanjaWriter from "../hanja-writing/HanjaWriter.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import HanjaExampleResult from "../paginated_results/HanjaExampleResult.jsx";
import KoreanResult from "../paginated_results/KoreanResult.jsx";

const HomePage = ({
    initialSeed,
    initialHanjaGameSeed,
    backToHanjaGameOrPushNewGame,
}) => {
    const [homepageData, setHomepageData] = useState();
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiFetch, apiPrefetch, loading, error, response } = useAPIFetcher();
    const [seed, setSeed] = useState(initialSeed);

    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    useEffect(() => {
        if (authInfo["token"]) {
            const setData = async () => {
                const data = await apiFetch(
                    `api/homepage_info/?seed=${seed}`,
                    authInfo["token"]
                );

                setHomepageData(data);
            };
            setData();

            const hanjaUrl = `api/hanja_game_info/?length=${HANJA_GAME_LENGTH}&seed=${initialHanjaGameSeed}`;
            apiPrefetch(hanjaUrl, authInfo["token"]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seed, authInfo["token"]]);

    return (
        <React.Fragment>
            {authInfo["token"] == null ? (
                <>
                    <div
                        className="lrpad-15 textcentered underlined"
                        style={{ marginTop: "50px", marginBottom: "50px" }}
                    >
                        로그인 후 개인에 맞는 홈페이지를 볼 수 있습니다.
                    </div>
                </>
            ) : (
                <div>
                    {loading ? (
                        <LoadingMessage />
                    ) : error ? (
                        <ErrorMessage errorResponse={response} />
                    ) : (
                        homepageData && (
                            <div>
                                <ButtonSection
                                    updateViewAndPushToHistory={
                                        updateViewAndPushToHistory
                                    }
                                    setSeed={setSeed}
                                    backToHanjaGameOrPushNewGame={
                                        backToHanjaGameOrPushNewGame
                                    }
                                />

                                {Object.keys(homepageData.same_hanja).length >
                                    0 && (
                                    <SameHanjaSection
                                        sameHanjaData={homepageData.same_hanja}
                                    />
                                )}

                                {homepageData.random_study_words.length > 0 && (
                                    <StudyWordSection
                                        studyWordData={
                                            homepageData.random_study_words
                                        }
                                    />
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default HomePage;

const ButtonSection = ({ setSeed, backToHanjaGameOrPushNewGame }) => {
    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];
    const updateCurrentViewInHistory =
        viewContext["updateCurrentViewInHistory"];
    return (
        <div className="space-children-horizontal pad-10">
            <button
                className="pad-10"
                style={{
                    borderColor: "#777777",
                }}
                onClick={() => {
                    const newSeed = Math.floor(Math.random() * 1000000);

                    const newView = {
                        view: "homepage",
                        value: newSeed,
                        searchBarInitialState: {
                            boxContent: "",
                            dictionary: "korean",
                        },
                    };

                    updateCurrentViewInHistory(newView);
                    setSeed(newSeed);
                }}
                title="홈페이지에 보이는 단어 바꾸기"
            >
                무작위
            </button>
            <button
                className="pad-10"
                style={{
                    borderColor: "#777777",
                }}
                onClick={() => {
                    backToHanjaGameOrPushNewGame();
                }}
                title="한자 잇기 게임에 바로가기"
            >
                게임
            </button>
            <button
                className="pad-10"
                style={{
                    borderColor: "#777777",
                }}
                onClick={() => {
                    updateViewAndPushToHistory(getBasicUnknownWordsView());
                }}
                title="아는 단어 추가 도우미로 바로가기"
            >
                단어 찾기 도구
            </button>
            <button
                className="pad-10"
                style={{
                    borderColor: "#777777",
                }}
                onClick={() => {
                    updateViewAndPushToHistory({
                        view: "user_known_words",
                        value: "",
                        searchBarInitialState: {
                            boxContent: "",
                            dictionary: "korean",
                        },
                    });
                }}
                title="아는 단어 추가 도우미로 바로가기"
            >
                아는 단어 목록
            </button>
            <button
                className="pad-10"
                style={{
                    borderColor: "#777777",
                }}
                onClick={() => {
                    updateViewAndPushToHistory(getNewStudyWordView);
                }}
                title="아는 단어 추가 도우미로 바로가기"
            >
                공부 단어 목록
            </button>
        </div>
    );
};

const StudyWordSection = ({ studyWordData }) => {
    return (
        <div className="curved-box tbmargin-10">
            <div className="curved-box-header">암기장에 추가한 단어</div>
            <ul className="full-width pad-10">
                {studyWordData &&
                    Object.entries(studyWordData).map((studyWordItem, id) => (
                        <li className="study-word-data" key={id}>
                            <KoreanResult result={studyWordItem[1]} />
                        </li>
                    ))}
            </ul>
        </div>
    );
};

const SameHanjaSection = ({ sameHanjaData }) => {
    const [hanjaDataLoadError, setHanjaDataLoadError] = useState(false);

    const ref = useRef(null);

    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    return (
        <div
            className="curved-box flex full-width tbmargin-10"
            style={{ flexDirection: "column" }}
        >
            <div className="curved-box-header">
                같은 한자가 포함되는 것을 알고 계셨나요?
            </div>
            {/* padding is reset to zero to make hanja writer look centered */}
            <ul className="full-width pad-10" style={{ paddingLeft: "0" }}>
                {sameHanjaData &&
                    Object.entries(sameHanjaData).map((sameHanjaItem, id) => (
                        <li key={id}>
                            <div className="flex full-width">
                                <div
                                    className="pointer textcentered"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        alignSelf: "center",
                                    }}
                                    onClick={() => {
                                        updateViewAndPushToHistory({
                                            view: "detail_hanja",
                                            value: {
                                                search_term: sameHanjaItem[0],
                                                initial_page: 1,
                                            },
                                            searchBarInitialState: {
                                                boxContent: sameHanjaItem[0],
                                                dictionary: "hanja",
                                            },
                                        });
                                    }}
                                >
                                    {!hanjaDataLoadError ? (
                                        <HanjaWriter
                                            character={sameHanjaItem[0]}
                                            writerArgs={{
                                                width: 100,
                                                height: 100,
                                                showCharacter: false,
                                                showOutline: false,
                                                strokeAnimationSpeed: 3,
                                                delayBetweenStrokes: 5,
                                                onLoadCharDataSuccess: () => {
                                                    setTimeout(() => {
                                                        if (ref.current) {
                                                            ref.current.animateCharacter();
                                                        }
                                                    }, 1000);
                                                },
                                                onLoadCharDataError: () => {
                                                    setHanjaDataLoadError(true);
                                                    console.log(
                                                        `failed to load data for ${sameHanjaItem[0]}`
                                                    );
                                                },
                                            }}
                                            ref={ref}
                                        />
                                    ) : (
                                        /* failsafe for if the data doesnt load properly.
                                    it will instead print the static unicode symbol */
                                        <span
                                            style={{
                                                fontSize: "50px",
                                            }}
                                        >
                                            {sameHanjaItem[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="same-hanja-section-examples">
                                    {/* first item in example. */}
                                    <div className="tbpad-10">
                                        <HanjaExampleResult
                                            result={sameHanjaItem[1][0]}
                                        />
                                    </div>
                                    {/* second item in example. */}
                                    <div className="tbpad-10">
                                        <HanjaExampleResult
                                            result={sameHanjaItem[1][1]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
