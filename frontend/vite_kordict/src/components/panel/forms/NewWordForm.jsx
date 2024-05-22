import React from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import ErrorMessage from "../messages/ErrorMessage.jsx";

const NewWordForm = () => {
    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        error,
        response,
    } = useAPIModifier({
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
                    <label htmlFor="word">단어</label>
                    <input
                        type="text"
                        name="word"
                        onChange={(e) => {
                            updateFormDataField("word", e.target.value);
                        }}
                    ></input>
                </div>

                <div>
                    <label htmlFor="origin">어원</label>
                    <input
                        type="text"
                        name="origin"
                        onChange={(e) => {
                            updateFormDataField("origin", e.target.value);
                        }}
                    ></input>
                </div>

                <div>
                    <label htmlFor="word_type">어류</label>
                    <select
                        type="text"
                        name="word_type"
                        onChange={(e) => {
                            updateFormDataField("word_type", e.target.value);
                        }}
                    >
                        {/* check for all of the options that are possible */}
                        <option value="어휘">어휘</option>
                        <option value="속담">속담</option>
                    </select>
                </div>

                <button type="submit">추가</button>
            </form>
            <div>
                {successful && <span>추가되었습니다.</span>}
                {error && <ErrorMessage errorResponse={response} />}
            </div>
        </>
    );
};

export default NewWordForm;
