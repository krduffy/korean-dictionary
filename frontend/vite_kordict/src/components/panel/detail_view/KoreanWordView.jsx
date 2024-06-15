import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import StringWithHanja from "../string_formatters/StringWithHanja.jsx";
import KnowStudyToggles from "./KnowStudyToggles.jsx";
import UserNote from "./UserNote.jsx";
import KoreanSenseView from "./sense_info_components/KoreanSenseView.jsx";
import SenseHistoryInfo from "./sense_info_components/SenseHistoryInfo.jsx";

import "./styles/korean-word-view-styles.css";

const KoreanWordView = ({ targetCode }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiFetch, loading, error, response } = useAPIFetcher();
    const [wordData, setWordData] = useState(null);
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];

    useEffect(() => {
        const setData = async () => {
            const data = await apiFetch(
                `api/korean_word/${targetCode}`,
                authInfo["token"]
            );
            setWordData(data);
        };

        setData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetCode]);

    return (
        <>
            {loading ? (
                <LoadingMessage />
            ) : error ? (
                <ErrorMessage errorResponse={response} />
            ) : (
                wordData && (
                    <div className="korean-word-view">
                        <span className="word-header">
                            <span>{wordData["word"]}</span>
                            {"  "}
                            {wordData["origin"] && (
                                <StringWithHanja string={wordData["origin"]} />
                            )}
                        </span>

                        <div className="word-extra-info-container">
                            <span className="word-extra-info">
                                {wordData["word_type"]}
                            </span>
                            {wordData["user_data"] && (
                                <KnowStudyToggles
                                    targetCode={wordData["target_code"]}
                                    initiallyKnown={
                                        wordData["user_data"]["is_known"]
                                    }
                                    initiallyStudied={
                                        wordData["user_data"]["is_studied"]
                                    }
                                />
                            )}
                            {wordData["created_by_user"] && (
                                <span className="word-extra-info">
                                    내가 추가한 단어
                                </span>
                            )}

                            <button
                                onClick={() => {
                                    updateViewAndPushToHistory({
                                        view: "edit_word",
                                        value: wordData["target_code"],
                                        searchBarInitialState: {
                                            boxContent: "",
                                            dictionary: "korean",
                                        },
                                    });
                                }}
                            >
                                노트 및 예문 수정
                            </button>
                        </div>

                        {wordData["notes"].length > 0 && (
                            <React.Fragment>
                                <p className="section-header">
                                    내가 추가한 노트
                                </p>
                                <div className="notes-container">
                                    {wordData["notes"].map((data, id) => (
                                        <UserNote noteData={data} key={id} />
                                    ))}
                                </div>
                            </React.Fragment>
                        )}

                        <div className="senses-container">
                            {wordData["senses"] &&
                                wordData["senses"].map((data) => (
                                    <KoreanSenseView
                                        key={data["target_code"]}
                                        senseData={data}
                                    />
                                ))}
                        </div>

                        <div>
                            {wordData["senses"] &&
                                wordData["senses"].length > 0 &&
                                wordData["senses"][0]["additional_info"] &&
                                wordData["senses"][0]["additional_info"][
                                    "history_info"
                                ] && (
                                    <SenseHistoryInfo
                                        historyInfo={
                                            wordData["senses"][0][
                                                "additional_info"
                                            ]["history_info"]
                                        }
                                    />
                                )}
                        </div>
                    </div>
                )
            )}
        </>
    );
};

KoreanWordView.propTypes = {
    targetCode: PropTypes.number.isRequired,
};

export default KoreanWordView;
