
import React from "react";

const SearchResult = ({ result }) => {
  return (
    <div class="result_box">
      <p class="header">
        <span class="word_header">{result.kw_word}</span>{'   '}
        <span class="origin_header">{result.kw_origin}</span>
      </p>
      
      <ul class="listed_senses">
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