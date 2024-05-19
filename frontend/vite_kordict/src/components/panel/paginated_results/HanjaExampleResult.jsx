import React, { useContext } from "react";
import PropTypes from "prop-types";

import { ViewContext } from "../Panel";
import StringWithHanja from "../string_formatters/StringWithHanja";
import StringWithNLP from "../string_formatters/StringWithNLP";

import "./styles/hanja-example-result-styles.css";

const HanjaExampleResult = ({ result }) => {
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
    <div>
      <div className="hanja_example_word">
        <span
          className="clickable-result"
          onClick={() => {
            viewKoreanDetail(result["kw_target_code"]);
          }}
        >
          {result["kw_word"]}
        </span>
        (
        <StringWithHanja string={result["kw_origin"]} />)
      </div>

      <div className="hanja_example_definition">
        <StringWithNLP
          string={result["kw_first_definition"]}
          hasExamples={false}
        />
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
