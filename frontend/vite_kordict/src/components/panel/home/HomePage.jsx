import React, { useContext, useEffect, useState } from "react";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { ViewContext } from "../Panel.jsx";
import HanjaWriter from "../hanja-writing/HanjaWriter.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import HanjaExampleResult from "../paginated_results/HanjaExampleResult.jsx";
import KoreanResult from "../paginated_results/KoreanResult.jsx";

import "./homepage-styles.css";

const HomePage = () => {
    const [homepageData, setHomepageData] = useState();
    const { apiFetch, loading, error } = useAPIFetcher();
    const [randomSeed, setRandomSeed] = useState(
        Math.floor(Math.random() * 1000000)
    );

    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    useEffect(() => {
        apiFetch(
            `http://127.0.0.1:8000/api/homepage_info/?seed=${randomSeed}`,
            setHomepageData
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [randomSeed]);

    return (
        <React.Fragment>
            {localStorage.getItem("username") == null ? (
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

const ButtonSection = ({ updateViewAndPushToHistory }) => {
    return (
        <div className="buttons">
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
        </div>
    );
};

const StudyWordSection = ({ studyWordData }) => {
    return (
        <div className="study-words">
            공부하는 단어
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
    return (
        <div className="same-hanja-section">
            <ul className="same-hanja-list-item">
                {sameHanjaData &&
                    Object.entries(sameHanjaData).map((sameHanjaItem, id) => (
                        <li className="same-hanja-example" key={id}>
                            <div className="single-same-hanja-container">
                                <div className="same-hanja-section-writer">
                                    <HanjaWriter
                                        character={sameHanjaItem[0]}
                                        writerArgs={{
                                            width: 100,
                                            height: 100,
                                            showCharacter: false,
                                            showOutline: false,
                                            strokeAnimationSpeed: 3,
                                            delayBetweenStrokes: 5,
                                        }}
                                    />
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
