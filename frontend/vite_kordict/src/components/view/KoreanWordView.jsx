
import React, { useState, useEffect } from "react"
import KoreanSenseView from "./KoreanSenseView";

const KoreanWordView = ({ targetCode }) => {

  const [ wordData, setWordData ] = useState({});

  useEffect(() => {
    console.log("tc is " +targetCode);
    const url = `http://127.0.0.1:8000/api/korean_word/${targetCode}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setWordData(data);
    })
    .catch(error => {
      console.error("Error while fetching results: ", error);
    });
  }, [targetCode]);

  return (
    <div className="korean-word-view">
      
      <span>{wordData["word"]}</span>
      <span>{wordData["origin"]}</span>
      <span>{wordData["word_type"]}</span>
  
      
    
    </div>
  );
}

export default KoreanWordView;