import React, { useState, useEffect, useContext } from "react";
import { ViewContext } from "../Panel.jsx";
import KoreanSenseView from "./sense_info_components/KoreanSenseView";
import StringWithHanja from "../StringWithHanja";
import PropTypes from "prop-types";
import { useAPIFetcher } from "../useAPIFetcher.js";
import { LoadingMessage } from "../../LoadingMessage.jsx";
import SenseHistoryInfo from "./sense_info_components/SenseHistoryInfo.jsx";
import "./styles/korean-word-view-styles.css";

const KoreanWordView = ({ targetCode, initialWordKnown }) => {
  const [wordData, setWordData] = useState({});
  const { apiFetch, loading, error } = useAPIFetcher();
  const [wordIsKnown, setWordIsKnown] = useState(false);

  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];

  const setData = (dataFromFetch) => {
    setWordData(dataFromFetch);
    setWordIsKnown(dataFromFetch["is_known"]);
  };

  useEffect(() => {
    apiFetch(`http://127.0.0.1:8000/api/korean_word/${targetCode}`, setData);
  }, [targetCode]);

  return (
    <>
      {loading ? (
        <LoadingMessage />
      ) : (
        <div className="korean-word-view">
          <span className="word-header">
            <span>{wordData["word"]}</span>
            {"  "}
            {wordData["origin"] && (
              <StringWithHanja string={wordData["origin"]} />
            )}
          </span>

          <div className="word-extra-info-container">
            <span className="word-extra-info">{wordData["word_type"]}</span>
            <span
              className="word-extra-info"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setWordIsKnown(!wordIsKnown);
                fetch(
                  `http://127.0.0.1:8000/api/toggle_word_known/${wordData["target_code"]}`,
                  { method: "PUT" },
                );
              }}
            >
              {wordIsKnown ? "아는  단어" : "모르는 단어"}
            </span>
            {wordData["created_by_user"] && (
              <span className="word-extra-info">내가 추가한 단어</span>
            )}

            <span
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
              수정
            </span>
          </div>

          <div className="senses-container">
            {wordData["senses"] &&
              wordData["senses"].map((data) => (
                <KoreanSenseView key={data["target_code"]} senseData={data} />
              ))}
          </div>

          <div>
            {wordData["senses"] &&
              wordData["senses"].length > 0 &&
              wordData["senses"][0]["additional_info"] &&
              wordData["senses"][0]["additional_info"]["history_info"] && (
                <SenseHistoryInfo
                  historyInfo={
                    wordData["senses"][0]["additional_info"]["history_info"]
                  }
                />
              )}
          </div>
        </div>
      )}
    </>
  );
};

KoreanWordView.propTypes = {
  targetCode: PropTypes.number.isRequired,
};

export default KoreanWordView;
