import React from "react";
import { useAPIModifier } from "../../../hooks/useAPIModifier";

const NewWordForm = () => {
  const { formData, updateFormDataField, apiModify, successful, error } =
    useAPIModifier({
      word: "",
      origin: "",
      word_type: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    apiModify("http://127.0.0.1:8000/api/create_word/", formData, "POST");
  };

  return (
    <>
      <div>새 단어 추가</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="word">word</label>
          <input
            type="text"
            name="word"
            onChange={(e) => {
              updateFormDataField("word", e.target.value);
            }}
          ></input>
        </div>

        <div>
          <label htmlFor="origin">origin</label>
          <input
            type="text"
            name="origin"
            onChange={(e) => {
              updateFormDataField("origin", e.target.value);
            }}
          ></input>
        </div>

        <div>
          <label htmlFor="word_type">word_type</label>
          <input
            type="text"
            name="word_type"
            onChange={(e) => {
              updateFormDataField("word_type", e.target.value);
            }}
          ></input>
        </div>

        <button type="submit">추가</button>
      </form>
      <div>
        {successful && <span>추가되었습니다.</span>}
        {error && <span>오류: {error}</span>}
      </div>
    </>
  );
};

export default NewWordForm;
