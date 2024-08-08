import React, { useContext, useEffect, useRef, useState } from "react";

import { getElementSizing } from "../../../../util/domUtils.js";
import { engKeyboardToKorean } from "../../../../util/stringUtils.js";
import {
    getBasicDetailHanjaView,
    getBasicSearchHanjaView,
    getBasicSearchKoreanView,
} from "../../../../util/viewUtils.js";

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

        if (dictionary === "korean") {
            updateViewAndPushToHistory(getBasicSearchKoreanView(fixedContent));
        } else if (dictionary === "hanja") {
            // if a single character then just render the detail view for that instead
            // of a single search result that the user would then need to click on

            if (fixedContent.match(/^[\u4E00-\u9FFF]$/g)) {
                updateViewAndPushToHistory(
                    getBasicDetailHanjaView(fixedContent)
                );
            } else {
                updateViewAndPushToHistory(
                    getBasicSearchHanjaView(fixedContent)
                );
            }
        }
    };

    return (
        <div className="search-bar">
            <DictionaryButtons
                dictionary={dictionary}
                setDictionary={setDictionary}
            />

            <form className="form-content" onSubmit={handleSubmit}>
                <input
                    ref={barRef}
                    type="text"
                    placeholder="검색어를 입력해주세요"
                    value={boxContent}
                    className="lrmargin-10"
                    style={{ padding: "2px" }}
                    onChange={(e) => {
                        setBoxContent(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") handleSubmit(e);
                    }}
                />
                <button type="submit">검색</button>
            </form>

            {showChangedMessage && <ChangedToHangulMessage barRef={barRef} />}
        </div>
    );
};

export default SearchBar;

const DictionaryButtons = ({ dictionary, setDictionary }) => {
    return (
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
        </div>
    );
};

const ChangedToHangulMessage = ({ barRef }) => {
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
};
