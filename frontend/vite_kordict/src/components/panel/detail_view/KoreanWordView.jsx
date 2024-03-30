import React, { useState, useEffect } from "react";
import KoreanSenseView from "./sense_info_components/KoreanSenseView";
import StringWithHanja from "../StringWithHanja";
import PropTypes from "prop-types";
import "./styles/korean-word-view-styles.css";

const KoreanWordView = ({ targetCode }) => {
  const [wordData, setWordData] = useState({});

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/korean_word/${targetCode}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWordData(data);
      })
      .catch((error) => {
        console.error("Error while fetching results: ", error);
      });
  }, [targetCode]);

  return (
    <div className="korean-word-view">
      <span className="word-header">
        <span>{wordData["word"]}</span>
        {"  "}
        <StringWithHanja stringWithHanja={wordData["origin"]} />
      </span>

      <div>{wordData["word_type"]}</div>

      <div className="senses-container">
        {wordData["senses"] &&
          wordData["senses"].map((data) => (
            <KoreanSenseView key={data["target_code"]} senseData={data} />
          ))}
      </div>
    </div>
  );
};

KoreanWordView.propTypes = {
  targetCode: PropTypes.number.isRequired,
};

export default KoreanWordView;
