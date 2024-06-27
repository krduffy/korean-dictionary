import React, { useContext, useEffect, useRef, useState } from "react";

import { getElementSizing } from "../../../../util/domUtils.js";
import { engKeyboardToKorean } from "../../../../util/stringUtils.js";

import { ViewContext } from "../Panel.jsx";
import PopupBox from "../string_formatters/PopupBox.jsx";

import "./styles/fixed-header-styles.css";

const SearchBar = () => {
    const barRef = useRef(null);

    const [boxContent, setBoxContent] = useState("");
    const [dictionary, setDictionary] = useState("korean");
    const [showChangedMessage, setShowChangedMessage] = useState(false);

    const searchBarInitialState =
        useContext(ViewContext)["currentView"]["searchBarInitialState"];
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];

    useEffect(() => {
        setBoxContent(searchBarInitialState["boxContent"]);
        setDictionary(searchBarInitialState["dictionary"]);
    }, [searchBarInitialState]);

    const sanitize = (content) => {
        const allowedUnicodeRanges = [
            // Korean Hangul characters
            "\uAC00-\uD7AF", // Hangul Syllables
            "\u1100-\u11FF", // Hangul Jamo
            "\u3130-\u318F", // Hangul Compatibility Jamo
            "\uA960-\uA97F", // Hangul Jamo Extended-A
            "\uD7B0-\uD7FF", // Hangul Jamo Extended-B

            "\u0061-\u007a", // a-z
            "\u0041-\u005a", // A-Z

            "\u0020", // space
            "\u002a", // asterisk (*)
            "\u002e", // period (.)

            "\u4e00-\u9fff", // Hanja characters (CJK Unified Ideographs)
        ];

        const pattern = new RegExp(`[^${allowedUnicodeRanges.join("")}]`, "g");

        return content.replace(pattern, "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const containsEng = boxContent.search(/[a-zA-z]/g) != -1;

        let fixedContent = boxContent.trim();
        if (containsEng) {
            fixedContent = engKeyboardToKorean(fixedContent);

            setShowChangedMessage(true);
            setTimeout(() => {
                setShowChangedMessage(false);
            }, 2000);
        }

        /* visual changes */
        setBoxContent(fixedContent);

        if (dictionary === "korean")
            updateViewAndPushToHistory({
                view: "search_korean",
                value: fixedContent,
                searchBarInitialState: {
                    boxContent: fixedContent,
                    dictionary: "korean",
                },
            });
        else if (dictionary === "hanja") {
            // if a single character then just render the detail view for that instead
            // of a single search result that the user would then need to click on
            if (fixedContent.match(/^[\u4E00-\u9FFF]$/g)) {
                updateViewAndPushToHistory({
                    view: "detail_hanja",
                    value: fixedContent,
                    searchBarInitialState: {
                        boxContent: fixedContent,
                        dictionary: "hanja",
                    },
                });
            } else {
                updateViewAndPushToHistory({
                    view: "search_hanja",
                    value: fixedContent,
                    searchBarInitialState: {
                        boxContent: fixedContent,
                        dictionary: "hanja",
                    },
                });
            }
        }
    };

    return (
        <div className="search-bar">
            <div className="dictionary-button-container">
                <button
                    className={
                        dictionary === "korean"
                            ? "activated-button"
                            : "not-activated-button"
                    }
                    onClick={() => setDictionary("korean")}
                    title="한국어 사전 검색"
                >
                    한
                </button>
                <button
                    className={
                        dictionary === "hanja"
                            ? "activated-button"
                            : "not-activated-button"
                    }
                    onClick={() => setDictionary("hanja")}
                    title="한자 사전 검색"
                >
                    漢
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard
                            .readText()
                            .then((clipboardData) => {
                                setBoxContent(clipboardData);
                            })
                            .catch((err) => {
                                console.error(
                                    "Error pasting clipboard content: " + err
                                );
                            });
                    }}
                    title="붙여넣기"
                >
                    🗐⤳
                </button>
            </div>

            <form className="form-content" onSubmit={handleSubmit}>
                <input
                    ref={barRef}
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={boxContent}
                    onChange={(e) => {
                        setBoxContent(sanitize(e.target.value));
                    }}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") handleSubmit(e);
                    }}
                />
                <button type="submit">검색</button>
            </form>

            {showChangedMessage &&
                (() => {
                    const dim = getElementSizing(barRef);

                    return (
                        <PopupBox
                            fromX={dim.centerX}
                            fromY={dim.centerY}
                            positioning={"above"}
                            padding={dim.paddingY + 10}
                        >
                            <div
                                style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                }}
                            >
                                영문 입력이 한글로 자동 변환되었습니다.
                            </div>
                        </PopupBox>
                    );
                })()}
        </div>
    );
};

export default SearchBar;
