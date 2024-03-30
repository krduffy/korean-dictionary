import React from "react";
import StringWithHanja from "../StringWithHanja";
import "./styles/hanja-example-result-styles.css";

const HanjaExampleResult = ({ result }) => {
  return (
    <div>
      <div className="hanja_example_word">
        {result["kw_word"]}
        (
        <StringWithHanja stringWithHanja={result["kw_origin"]} />)
      </div>

      <div className="hanja_example_definition">
        <StringWithHanja stringWithHanja={result["kw_first_definition"]} />
      </div>
    </div>
  );
};

export default HanjaExampleResult;
