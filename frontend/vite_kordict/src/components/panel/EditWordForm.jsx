import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIFetcher } from "./useAPIFetcher.js";
import { LoadingMessage } from "../LoadingMessage.jsx";
import "./detail_view/styles/korean-word-view-styles.css";

const EditWordForm = ({ targetCode }) => {
  const [wordData, setWordData] = useState({});
  const { apiFetch, loading, error } = useAPIFetcher();

  useEffect(() => {
    apiFetch(
      `http://127.0.0.1:8000/api/korean_word/${targetCode}`,
      setWordData,
    );
  }, [targetCode]);

  return (
    <>
      {loading ? (
        <LoadingMessage />
      ) : (
        <div className="korean-word-view">
          <span className="word-header">
            <span>{wordData["word"]}</span>
            {"  [수정]"}
          </span>

          <AddExampleForm wordTargetCode={wordData["target_code"]} />
          {/*
          <div className="senses-container">
            {formData["senses"] &&
              formData["senses"].map((data) => (
                <KoreanSenseView key={data["target_code"]} senseData={data} />
              ))}
          </div>
            */}
        </div>
      )}
    </>
  );
};

export default EditWordForm;

const AddExampleForm = ({ wordTargetCode }) => {
  return (
    <div className="add-example-form">
      <h1>예문 추가</h1>
      <h3>중활고에 단어를 담으면 밑줄을 그립니다.</h3>
      <textarea></textarea>
    </div>
  );
};
