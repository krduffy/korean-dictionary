import React, { useContext, useEffect, useRef, useState } from "react";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import HanjaWriter from "../hanja-writing/HanjaWriter.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import HanjaExampleResult from "../paginated_results/HanjaExampleResult.jsx";
import KoreanResult from "../paginated_results/KoreanResult.jsx";

import "./homepage-styles.css";

const HomePage = ({ initialSeed }) => {
    const [homepageData, setHomepageData] = useState();
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiFetch, loading, error } = useAPIFetcher();
    const [seed, setSeed] = useState(initialSeed);

    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    useEffect(() => {
        if (authInfo["token"]) {
            apiFetch(
                `http://127.0.0.1:8000/api/homepage_info/?seed=${seed}`,
                authInfo["token"],
                setHomepageData
            );
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
                        <ErrorMessage errorStrings={error} />
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
            >
                게임
            </button>
            <button
                onClick={() => {
                    if (currentView["view"] !== "add_word") {
                        updateViewAndPushToHistory({
                            view: "add_word",
                            value: 0,
                            searchBarInitialState: {
                                boxContent: "",
                                dictionary: "korean",
                            },
                        });
                    }
                }}
            ></button>
        </div>
    );
};

const StudyWordSection = ({ studyWordData }) => {
    return (
        <div className="study-words">
            <div className="homepage-section-header">암기장에 추가한 단어</div>
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
            <div className="homepage-section-header">
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
                                                    ref.current.animateCharacter();
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
