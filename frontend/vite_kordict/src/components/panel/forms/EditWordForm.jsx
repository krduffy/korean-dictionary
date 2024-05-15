import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAPIFetcher } from "../useAPIFetcher.js";
import { LoadingMessage } from "../../LoadingMessage.jsx";
import { useAPIModifier } from "../useAPIModifier.js";
import "./form-styles.css";

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

const AddExampleForm = ({ wordTargetCode, alreadyAtLeastOneExample }) => {
  const [showForm, setShowForm] = useState(false);
  const [exampleText, setExampleText] = useState("");
  const [sourceText, setSourceText] = useState("");
  const { apiModify, successful, error } = useAPIModifier();

  const handleSubmit = () => {};

  return (
    <div className="add-example-form">
      <div className="add-example-form-upper-bar">
        <div className="add-example-header">예문 추가</div>
      </div>

      <div className="text-area-container">
        <dl>
          <dt className="text-area-container-dt">예문 (필수)</dt>
          <dd className="text-area-container-dd">
            <textarea
              className="add-example-text-area"
              value={exampleText}
              onChange={(event) => setExampleText(event.target.value)}
            ></textarea>
          </dd>
        </dl>
        <dl>
          <dt className="text-area-container-dt">출처 (선택)</dt>
          <dd className="text-area-container-dd">
            <textarea
              className="add-example-text-area"
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
            ></textarea>
          </dd>
        </dl>
      </div>

      <div className="add-example-form-lower-bar">
        <div className="add-example-tip">
          예문 입력 시 중활고에 담는 단어 아래에 밑줄을 그려줍니다.
        </div>
        <div className="add-example-submit-button">추가</div>
      </div>
    </div>
  );
};
