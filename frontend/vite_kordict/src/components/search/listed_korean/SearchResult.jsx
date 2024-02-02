
import React from "react";

const SearchResult = ({ result }) => {
  return (
    <div>
      <h3>{result.kw_word}</h3>
      <p>{result.kw_first_sense_def}</p>
    </div>
  );
}

export default SearchResult;