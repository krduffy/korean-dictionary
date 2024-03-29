
import React, { useContext } from "react";
import { UpdateHistoryContext, ViewContext } from "../Panel.jsx";
import StringWithHanja from "../StringWithHanja.jsx";
import "./styles/korean-result-styles.css";
import "../universal-styles.css";

const KoreanResult = ({ result }) => {

  const viewContext = useContext(ViewContext);
  const setHistoryNeedsUpdating = useContext(UpdateHistoryContext);

  const viewKoreanDetail = (targetCode) => {
    viewContext["setCurrentView"](
      {
        "view": "detail_korean",
        "value": targetCode
      }
    )
    setHistoryNeedsUpdating(true);
  };

  return (
    <div className="result_box">
      <div className="header">
        <span onClick={() => viewKoreanDetail(result.kw_target_code)} 
          className="word_header clickable-result">
            {result.kw_word}
        </span>
            
        {'   '}

        <StringWithHanja stringWithHanja={result.kw_origin} />
      </div>
      
      <ul className="listed_senses">
      { result.kw_senses.map((sense) => 
        (
          <li key={sense.s_order}>
            {sense.s_order}.{' '}
            <span style={{ color: '#8e44ad' }}>{sense.s_pos}</span>{' '}
            <span style={{ color: '#3498db' }}>{sense.s_category}</span>{' '}

            <StringWithHanja stringWithHanja={sense.s_definition} />
          </li>
        )
      )}
      </ul>

      <p>출처: 우리말샘</p>
    </div>
  );
}

export default KoreanResult;