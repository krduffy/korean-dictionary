import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";
import { useSpamProtectedSetter } from "../../../hooks/useSpamProtectedSetter.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";
import LoadErrorOrChild from "../messages/LoadErrorOrChild.jsx.jsx";
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

    const getData = async () => {
        const data = await apiFetch(
            `api/korean_word/${targetCode}`,
            authInfo["token"]
        );
        return data;
    };

    const spamProtectedSetData = useSpamProtectedSetter({
        dataGetter: getData,
        setter: setWordData,
    });

    useEffect(() => {
        spamProtectedSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetCode]);

    return (
        <LoadErrorOrChild loading={loading} error={error} response={response}>
            {wordData && (
                <>
                    {/* WORD ITSELF AND ORIGIN, eg
                              사과 沙果/砂果        */}
                    <WordAndOrigin
                        word={wordData.word}
                        origin={wordData.origin}
                    />

                    {/* Type of word (어휘 등), buttons for known and studying, 
                            button for editing        */}
                    <TypeAndUserButtons
                        wordType={wordData.word_type}
                        userData={wordData.user_data}
                        updateViewAndPushToHistory={updateViewAndPushToHistory}
                        targetCode={wordData.target_code}
                    />

                    {/* Lower section */}

                    {/* NOTES */}
                    {wordData.notes?.length > 0 && (
                        <NoteSection notes={wordData.notes} />
                    )}

                    {/* SENSE #0 (USER EXAMPLES) 
                            Component returns null if sense #0 does not exist. */}
                    <UserExampleSentencesSection senses={wordData.senses} />

                    {/* OTHER SENSES */}
                    {wordData.senses && (
                        <SenseSection
                            senses={wordData.senses.filter(
                                (data) => data.order !== 0
                            )}
                        />
                    )}

                    {/* HISTORY 
                            History is stored at the sense level to allow for
                            individual histories for different senses of the same
                            word in the case that they need to be separately rendered
                            Right now, only the first sense's history is shown at the bottom
                            because most of the senses have the same history */}

                    {wordData.senses?.[0]?.additional_info?.history_info && (
                        <HistorySection
                            historyInfo={
                                wordData["senses"][0]["additional_info"][
                                    "history_info"
                                ]
                            }
                        />
                    )}
                </>
            )}
        </LoadErrorOrChild>
    );
};

KoreanWordView.propTypes = {
    targetCode: PropTypes.number.isRequired,
};

export default KoreanWordView;

const WordAndOrigin = ({ word, origin }) => {
    return (
        <div
            style={{
                fontSize: "50px",
            }}
        >
            <span>{word}</span>

            {origin && (
                <>
                    {" "}
                    <StringWithHanja string={origin} />
                </>
            )}
        </div>
    );
};

const TypeAndUserButtons = ({
    wordType,
    userData,
    updateViewAndPushToHistory,
    targetCode,
}) => {
    return (
        <div
            className="space-children-horizontal tbpad-10"
            style={{ fontSize: "20px" }}
        >
            <span className="word-extra-info word-emphasized-box">
                {wordType}
            </span>

            {userData && (
                <button
                    onClick={() => {
                        updateViewAndPushToHistory({
                            view: "edit_word",
                            value: targetCode,
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

            {userData && (
                <KnowStudyToggles
                    targetCode={targetCode}
                    initiallyKnown={userData.is_known}
                    initiallyStudied={userData.is_studied}
                />
            )}
            {/*wordData["created_by_user"] && (
                                <span className="word-extra-info">
                                    내가 추가한 단어
                                </span>
                            )*/}
        </div>
    );
};

const NoteSection = ({ notes }) => {
    return (
        <div className="curved-box tbmargin-10">
            <p className="curved-box-header">내가 추가한 이미지</p>
            <div
                className="pad-10"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridAutoRows: "minmax(100px, auto)",
                    gap: "8px",
                }}
            >
                {notes.map((data, id) => (
                    <UserNote
                        noteData={data}
                        disableClick={false}
                        nestLevel={1}
                        key={id}
                    />
                ))}
            </div>
        </div>
    );
};

const UserExampleSentencesSection = ({ senses }) => {
    const senseNumZero = senses.find((data) => data.order === 0);

    if (!senseNumZero) {
        return null;
    } else
        return (
            <div className="curved-box tbmargin-10">
                <div className="curved-box-header">내가 추가한 예문</div>
                <div
                    style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                    }}
                    key={0}
                >
                    <KoreanSenseView senseData={senseNumZero} />
                </div>
            </div>
        );
};

const SenseSection = ({ senses }) => {
    return (
        <div className="curved-box tbmargin-10">
            <div className="curved-box-header">뜻풀이</div>
            <div className="pad-10">
                {senses.map((data) => (
                    <div
                        className="curved-box-nest1"
                        style={{
                            margin: "10px",
                        }}
                        key={data["target_code"]}
                    >
                        <KoreanSenseView senseData={data} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const HistorySection = ({ historyInfo }) => {
    return (
        <div className="curved-box tbmargin-10">
            <div className="curved-box-header">역사 정보</div>
            <div className="pad-10">
                <SenseHistoryInfo historyInfo={historyInfo} />
            </div>
        </div>
    );
};
