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
                        <div
                            style={{
                                fontSize: "50px",
                            }}
                        >
                            <span>{wordData["word"]}</span>
                            {"  "}
                            {wordData["origin"] && (
                                <StringWithHanja string={wordData["origin"]} />
                            )}
                        </div>

                        {/* Type of word (어휘 등), buttons for known and studying, 
                            button for editing        */}
                        <div
                            className="space-children-horizontal tbpad-10"
                            style={{ fontSize: "20px" }}
                        >
                            <span className="word-extra-info word-emphasized-box">
                                {wordData["word_type"]}
                            </span>

                            {wordData?.user_data && (
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
                            )}

                            {wordData?.user_data && (
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
                        </div>

                        <div>
                            {/* NOTES */}
                            {wordData["notes"].length > 0 && (
                                <div className="curved-box tbmargin-10">
                                    <p className="curved-box-header">
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
                                </div>
                            )}

                            {/* SENSE #0 (USER EXAMPLES) */}
                            {wordData["senses"].some(
                                (data) => data.order === 0
                            ) && (
                                <div className="curved-box tbmargin-10">
                                    <div className="curved-box-header">
                                        내가 추가한 예문
                                    </div>
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            marginBottom: "10px",
                                        }}
                                        key={0}
                                    >
                                        <KoreanSenseView
                                            senseData={wordData["senses"].find(
                                                (data) => data.order === 0
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* OTHER SENSES */}
                            {wordData["senses"] && (
                                <div className="curved-box tbmargin-10">
                                    <div className="curved-box-header">
                                        뜻풀이
                                    </div>
                                    <div className="pad-10">
                                        {wordData["senses"]
                                            .filter((data) => data.order !== 0)
                                            .map((data) => (
                                                <div
                                                    className="curved-box-nest1"
                                                    style={{
                                                        margin: "10px",
                                                    }}
                                                    key={data["target_code"]}
                                                >
                                                    <KoreanSenseView
                                                        senseData={data}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* HISTORY 
                            History is stored at the sense level to allow for
                            individual histories for different senses of the same
                            word in the case that they need to be separately rendered
                            Right now, only the first sense's history is shown at the bottom
                            because most of the senses have the same history */}

                            {wordData.senses?.[0]?.additional_info
                                ?.history_info && (
                                <div className="curved-box tbmargin-10">
                                    <div className="curved-box-header">
                                        역사 정보
                                    </div>
                                    <div className="pad-10">
                                        <SenseHistoryInfo
                                            historyInfo={
                                                wordData["senses"][0][
                                                    "additional_info"
                                                ]["history_info"]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
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
