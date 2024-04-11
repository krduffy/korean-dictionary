import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { ViewContext } from "../Panel.jsx";
import StringWithHanja from "../StringWithHanja.jsx";
import "./styles/korean-result-styles.css";
import "../universal-styles.css";

const KoreanResult = ({ result }) => {
  const viewContext = useContext(ViewContext);
  const [wordIsKnown, setWordIsKnown] = useState(result.kw_is_known);

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

        <button
          onClick={() => {
            setWordIsKnown(!wordIsKnown);
            fetch(
              `http://127.0.0.1:8000/api/toggle_word_known/${result.kw_target_code}`,
              { method: "PUT" },
            );
          }}
        >
          {wordIsKnown ? "앎" : "모름"}
        </button>
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

      <p>출처: 우리말샘</p>
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
    kw_is_known: PropTypes.bool.isRequired,
  }).isRequired,
};

export default KoreanResult;
