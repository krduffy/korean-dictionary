import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { ViewContext } from "../Panel.jsx";
import StringWithHanja from "../StringWithHanja.jsx";
import "./styles/korean-result-styles.css";
import "../universal-styles.css";

const KoreanResult = ({ result }) => {
  const viewContext = useContext(ViewContext);

  const viewKoreanDetail = (targetCode) => {
    viewContext["updateViewAndPushToHistory"]({
      view: "detail_korean",
      value: targetCode,
      searchBarInitialState: {
        boxContent: result["kw_word"],
        dictionary: "korean",
      },
    });
  };

  return (
    <div className="result_box">
      <div className="header">
        <span
          onClick={() => viewKoreanDetail(result.kw_target_code)}
          className="word_header clickable-result"
        >
          {result.kw_word}
        </span>

        {"   "}

        {result.kw_origin && <StringWithHanja string={result.kw_origin} />}
      </div>

      <ul className="listed_senses">
        {result.kw_senses.map((sense) => (
          <li key={sense.s_order}>
            {sense.s_order}.{" "}
            <span style={{ color: "#8e44ad" }}>{sense.s_pos}</span>{" "}
            <span style={{ color: "#3498db" }}>{sense.s_category}</span>{" "}
            <StringWithHanja string={sense.s_definition} />
          </li>
        ))}
      </ul>

      <p>
        {result.kw_user_data && result.kw_user_data["kw_added_by_user"]
          ? "내가 추가한 단어"
          : "출처: 우리말샘"}
      </p>
    </div>
  );
};

KoreanResult.propTypes = {
  result: PropTypes.shape({
    kw_target_code: PropTypes.number.isRequired,
    kw_word: PropTypes.string.isRequired,
    kw_origin: PropTypes.string.isRequired,
    kw_senses: PropTypes.arrayOf(
      PropTypes.shape({
        s_order: PropTypes.number.isRequired,
        s_pos: PropTypes.string.isRequired,
        s_category: PropTypes.string.isRequired,
        s_definition: PropTypes.string.isRequired,
      }),
    ).isRequired,
    kw_user_data: PropTypes.shape({
      kw_is_known: PropTypes.bool,
      kw_is_studied: PropTypes.bool,
      kw_created_by_user: PropTypes.bool,
    }),
  }).isRequired,
};

export default KoreanResult;
