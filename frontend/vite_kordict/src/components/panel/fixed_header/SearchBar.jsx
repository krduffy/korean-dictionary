import React, { useState, useEffect, useContext } from "react";
import { ViewContext } from "../Panel.jsx";
import "./styles/fixed-header-styles.css";

const SearchBar = () => {
  const [boxContent, setBoxContent] = useState("");
  const [dictionary, setDictionary] = useState("korean");

  const searchBarInitialState =
    useContext(ViewContext)["currentView"]["searchBarInitialState"];
  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];

  useEffect(() => {
    setBoxContent(searchBarInitialState["boxContent"]);
    setDictionary(searchBarInitialState["dictionary"]);
  }, [searchBarInitialState]);

  const sanitize = (content) => {
    content = content.trim();

    const allowedUnicodeRanges = [
      // Korean Hangul characters
      "\uAC00-\uD7AF", // Hangul Syllables
      "\u1100-\u11FF", // Hangul Jamo
      "\u3130-\u318F", // Hangul Compatibility Jamo
      "\uA960-\uA97F", // Hangul Jamo Extended-A
      "\uD7B0-\uD7FF", // Hangul Jamo Extended-B

      "\u005f", // underscore (_)
      "\u002a", // asterisk (*)
      "\u4e00-\u9fff", // Hanja characters (CJK Unified Ideographs)
    ];

    const pattern = new RegExp(`[^${allowedUnicodeRanges.join("")}]`, "g");

    return content.replace(pattern, "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dictionary === "korean")
      updateViewAndPushToHistory({
        view: "search_korean",
        value: boxContent,
        searchBarInitialState: {
          boxContent: boxContent,
          dictionary: "korean",
        },
      });
    else if (dictionary === "hanja") {
      // if a single character then just render the detail view for that instead
      // of a single search result that the user would then need to click on
      if (boxContent.match(/^[\u4E00-\u9FFF]$/g)) {
        updateViewAndPushToHistory({
          view: "detail_hanja",
          value: boxContent,
          searchBarInitialState: {
            boxContent: boxContent,
            dictionary: "hanja",
          },
        });
      } else {
        updateViewAndPushToHistory({
          view: "search_hanja",
          value: boxContent,
          searchBarInitialState: {
            boxContent: boxContent,
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
        >
          한
        </button>
        <button
          className={
            dictionary === "hanja" ? "activated-button" : "not-activated-button"
          }
          onClick={() => setDictionary("hanja")}
        >
          漢
        </button>
      </div>

      <form className="form-content" onSubmit={handleSubmit}>
        <input
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
    </div>
  );
};

export default SearchBar;
