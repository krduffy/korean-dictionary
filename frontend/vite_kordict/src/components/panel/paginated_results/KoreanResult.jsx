import React, { useContext } from "react";
import PropTypes from "prop-types";
import { UpdateHistoryContext, ViewContext } from "../Panel.jsx";
import StringWithHanja from "../StringWithHanja.jsx";
import "./styles/korean-result-styles.css";
import "../universal-styles.css";

const KoreanResult = ({ result }) => {
  const viewContext = useContext(ViewContext);
  const setHistoryNeedsUpdating = useContext(UpdateHistoryContext);

  const viewKoreanDetail = (targetCode) => {
    viewContext["setCurrentView"]({
      view: "detail_korean",
      value: targetCode,
      /* search_word specifically for filling search box when history is restored;
           is read in Panel.jsx when "view" === "detail_korean" */
      detail_korean_word: result.kw_word,
    });
    setHistoryNeedsUpdating(true);
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

        <StringWithHanja stringWithHanja={result.kw_origin} />
      </div>

      <ul className="listed_senses">
        {result.kw_senses.map((sense) => (
          <li key={sense.s_order}>
            {sense.s_order}.{" "}
            <span style={{ color: "#8e44ad" }}>{sense.s_pos}</span>{" "}
            <span style={{ color: "#3498db" }}>{sense.s_category}</span>{" "}
            <StringWithHanja stringWithHanja={sense.s_definition} />
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
  }).isRequired,
};

export default KoreanResult;
