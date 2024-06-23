import React, { useContext, useEffect, useRef, useState } from "react";

import { HANJA_GAME_LENGTH } from "../../../constants.js";
import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import HanjaWriter from "../hanja-writing/HanjaWriter.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import HanjaExampleResult from "../paginated_results/HanjaExampleResult.jsx";
import KoreanResult from "../paginated_results/KoreanResult.jsx";

import "./homepage-styles.css";

const HomePage = ({ initialSeed, initialHanjaGameSeed }) => {
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
                <div className="logged-out-homepage">
                    로그인 후 개인에 맞는 홈페이가 볼 수 있습니다.
                </div>
            ) : (
                <div className="logged-in-homepage">
                    {loading ? (
                        <LoadingMessage />
                    ) : error ? (
                        <ErrorMessage errorResponse={response} />
                    ) : (
                        homepageData && (
                            <div id="homepage-main-content">
                                <ButtonSection
                                    updateViewAndPushToHistory={
                                        updateViewAndPushToHistory
                                    }
                                    setSeed={setSeed}
                                />

                                <SameHanjaSection
                                    sameHanjaData={homepageData.same_hanja}
                                />

                                <StudyWordSection
                                    studyWordData={
                                        homepageData.random_study_words
                                    }
                                />
                            </div>
                        )
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default HomePage;

const ButtonSection = ({ setSeed }) => {
    const viewContext = useContext(ViewContext);
    const currentView = viewContext["currentView"];
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];
    const updateCurrentViewInHistory =
        viewContext["updateCurrentViewInHistory"];
    return (
        <div className="buttons">
            <button
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
                onClick={() => {
                    updateViewAndPushToHistory({
                        view: "hanja_game",
                        value: "?",
                        searchBarInitialState: {
                            boxContent: "漢字",
                            dictionary: "hanja",
                        },
                    });
                }}
                title="한자 잇기 게임에 바로가기"
            >
                게임
            </button>
            <button
                onClick={() => {
                    updateViewAndPushToHistory({
                        view: "get_unknown_words",
                        value: 0,
                        searchBarInitialState: {
                            boxContent: "",
                            dictionary: "korean",
                        },
                    });
                }}
                title="아는 단어 추가 도우미로 바로가기"
            >
                단어 찾기 도구
            </button>
            <button
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
                onClick={() => {
                    updateViewAndPushToHistory({
                        view: "user_study_words",
                        value: "",
                        searchBarInitialState: {
                            boxContent: "",
                            dictionary: "korean",
                        },
                    });
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
        <div className="study-words">
            <div className="section-header">암기장에 추가한 단어</div>
            <ul className="study-word-list-item">
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
        <div className="same-hanja-section">
            <div className="section-header">
                같은 한자가 포함되는 것을 알고 계셨나요?
            </div>
            <ul className="same-hanja-list-item">
                {sameHanjaData &&
                    Object.entries(sameHanjaData).map((sameHanjaItem, id) => (
                        <li className="same-hanja-example" key={id}>
                            <div className="single-same-hanja-container">
                                <div
                                    className="same-hanja-section-writer"
                                    onClick={() => {
                                        updateViewAndPushToHistory({
                                            view: "detail_hanja",
                                            value: sameHanjaItem[0],
                                            searchBarInitialState: {
                                                boxContent: sameHanjaItem[0],
                                                dictionary: "hanja",
                                            },
                                        });
                                    }}
                                >
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
                                    {/* failsafe for if the data doesnt load properly.
                                    it will instead print the static unicode symbol */}
                                    {hanjaDataLoadError && (
                                        <span>{sameHanjaItem[0]}</span>
                                    )}
                                </div>
                                <div className="same-hanja-section-examples">
                                    {/* first item in example. */}
                                    <HanjaExampleResult
                                        result={sameHanjaItem[1][0]}
                                    />
                                    {/* second item in example. */}
                                    <HanjaExampleResult
                                        result={sameHanjaItem[1][1]}
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};
