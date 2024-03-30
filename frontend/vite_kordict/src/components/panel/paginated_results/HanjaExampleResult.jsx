import React from "react";
import PropTypes from "prop-types";
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

HanjaExampleResult.propTypes = {
  result: PropTypes.shape({
    kw_word: PropTypes.string.isRequired,
    kw_origin: PropTypes.string.isRequired,
    kw_first_definition: PropTypes.string.isRequired,
  }).isRequired,
};

export default HanjaExampleResult;
