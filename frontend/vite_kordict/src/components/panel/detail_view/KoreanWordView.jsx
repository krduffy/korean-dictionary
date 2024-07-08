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

/**
 * A component for viewing a Korean word's data in detail, taking up the entire view area.
 *
 * @param {Object} props - Component props.
 * @param {number} props.targetCode - The target code of the word to be displayed.
 * @returns {React.JSX.Element} The rendered KoreanWordView component.
 */
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
                    <>
                        {/* WORD ITSELF AND ORIGIN, eg
                              사과 沙果/砂果        */}
                        <div className="word-header">
                            <span>{wordData["word"]}</span>
                            {"  "}
                            {wordData["origin"] && (
                                <StringWithHanja string={wordData["origin"]} />
                            )}
                        </div>

                        {/* Type of word (어휘 등), buttons for known and studying, 
                            button for editing        */}
                        <div className="word-extra-info-container space-children-horizontal">
                            <span className="word-extra-info word-emphasized-box">
                                {wordData["word_type"]}
                            </span>
                            <div>
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
                                {/*wordData["created_by_user"] && (
                                <span className="word-extra-info">
                                    내가 추가한 단어
                                </span>
                            )*/}

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
                        </div>

                        <div>
                            {/* NOTES */}
                            {wordData["notes"].length > 0 && (
                                <>
                                    <p className="section-header">
                                        내가 추가한 노트
                                    </p>
                                    <div
                                        className="pad-10"
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(3, 1fr)",
                                            gridAutoRows: "minmax(100px, auto)",
                                            gap: "8px",
                                        }}
                                    >
                                        {wordData["notes"].map((data, id) => (
                                            <UserNote
                                                noteData={data}
                                                key={id}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* SENSES */}
                            {wordData["senses"] &&
                                wordData["senses"].map((data) => (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            marginBottom: "10px",
                                        }}
                                        key={data["target_code"]}
                                    >
                                        <KoreanSenseView senseData={data} />
                                    </div>
                                ))}

                            {/* HISTORY 
                            History is stored at the sense level to allow for
                            individual histories for different senses of the same
                            word in the case that they need to be separately rendered
                            Right now, only the first sense's history is shown at the bottom
                            because most of the senses have the same history */}
                            <div>
                                {wordData.senses?.[0]?.additional_info
                                    ?.history_info && (
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
                    </>
                )
            )}
        </>
    );
};

KoreanWordView.propTypes = {
    targetCode: PropTypes.number.isRequired,
};

export default KoreanWordView;
