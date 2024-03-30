import React, { useState, useEffect, useContext } from "react";
import { ViewContext, EntireHistoryContext } from "../Panel.jsx";
import "./styles/search-bar-styles.css";

const SearchBar = () => {
  const [boxContent, setBoxContent] = useState("");
  const [dictionary, setDictionary] = useState("korean");

  const view = useContext(ViewContext)["currentView"];
  const setView = useContext(ViewContext)["setCurrentView"];
  const initialState = useContext(EntireHistoryContext)["searchInitialState"];
  const setHistoryNeedsUpdating =
    useContext(EntireHistoryContext)["setHistoryNeedsUpdating"];

  useEffect(() => {
    setBoxContent(initialState["boxContent"]);
    setDictionary(initialState["dictionary"]);
  }, [initialState]);

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

    if (boxContent.match(/^[\u4E00-\u9FFF]$/g))
      setView({
        view: "detail_hanja",
        value: boxContent,
      });
    else if (dictionary === "korean")
      setView({
        view: "search_korean",
        value: boxContent,
      });
    else if (dictionary === "hanja")
      setView({
        view: "search_hanja",
        value: boxContent,
      });

    setHistoryNeedsUpdating(true);
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
