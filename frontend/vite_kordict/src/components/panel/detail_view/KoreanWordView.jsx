
import React, { useState, useEffect } from "react"
import KoreanSenseView from "./KoreanSenseView";

const KoreanWordView = ({ targetCode }) => {

  const [ wordData, setWordData ] = useState({});

  useEffect(() => {
    const url = `http://127.0.0.1:8000/api/korean_word/${targetCode}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      setWordData(data);
    })
    .catch(error => {
      console.error("Error while fetching results: ", error);
    });
  }, [targetCode]);

  return (
    <div className="korean-word-view">
      <span>{wordData["word"]}</span>
      <span>{'  '}{wordData["origin"]}</span>
      <div>{wordData["word_type"]}</div>

      <div className="senses-container">
      { wordData["senses"] && wordData["senses"].map( (data) => (
          <KoreanSenseView key={data["target_code"]} senseData={data} />
      ))}
      </div>
    </div>
  );
}

export default KoreanWordView;