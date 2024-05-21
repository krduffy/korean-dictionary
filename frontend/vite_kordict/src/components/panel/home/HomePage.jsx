import React, { useContext, useEffect, useState } from "react";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { LoadingMessage } from "../../LoadingMessage.jsx";
import { ViewContext } from "../Panel.jsx";
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

    useEffect(() => {
        apiFetch(
            `http://127.0.0.1:8000/api/homepage_info/?seed=${randomSeed}`,
            setHomepageData
        );
    }, []);

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
                    ) : (
                        <div id="homepage-main-content">
                            <div className="buttons">
                                <button
                                    onClick={() => {
                                        viewContext[
                                            "updateViewAndPushToHistory"
                                        ]({
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
                            <div className="study-words">
                                공부하는 단어
                                <ul className="study-word-list-item">
                                    {homepageData &&
                                        homepageData.random_study_words &&
                                        Object.entries(
                                            homepageData.random_study_words
                                        ).map((studyWordItem, id) => (
                                            <li
                                                className="study-word-data"
                                                key={id}
                                            >
                                                <KoreanResult
                                                    result={studyWordItem[1]}
                                                />
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            <div className="same-hanja-section">
                                알고 계셨나요? 이 단어들은 같은 한자가 포함된다.
                                <ul className="same-hanja-list-item">
                                    {homepageData &&
                                        homepageData.same_hanja &&
                                        Object.entries(
                                            homepageData.same_hanja
                                        ).map((sameHanjaItem, id) => (
                                            <li
                                                className="same-hanja-example"
                                                key={id}
                                            >
                                                <span>{sameHanjaItem[0]}</span>

                                                {/* first item in example. */}
                                                <HanjaExampleResult
                                                    result={sameHanjaItem[1][0]}
                                                />
                                                {/* second item in example. */}
                                                <HanjaExampleResult
                                                    result={sameHanjaItem[1][1]}
                                                />
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </React.Fragment>
    );
};

export default HomePage;
