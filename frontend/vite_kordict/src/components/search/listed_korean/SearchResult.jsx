
import React from "react";

const SearchResult = ({ result }) => {
  return (
    <div className="result_box">
      <p className="header">
        <span className="word_header">{result.kw_word}</span>{'   '}
        <span className="origin_header">{result.kw_origin}</span>
      </p>
      
      <ul className="listed_senses">
      { result.kw_senses.map((sense) => (
        <li key={sense.s_order}>
          {sense.s_order}.{' '}
          <span style={{ color: '#8e44ad' }}>{sense.s_pos}</span>{' '}
          <span style={{ color: '#3498db' }}>{sense.s_category}</span>{' '}
          {sense.s_definition}
        </li>
      ))}
      </ul>

      <p>출처: 우리말샘</p>
    </div>
  );
}

export default SearchResult;