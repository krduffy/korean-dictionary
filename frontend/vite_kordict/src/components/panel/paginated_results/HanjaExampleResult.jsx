import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ViewContext } from "../Panel";
import StringWithHanja from "../StringWithHanja";
import "./styles/hanja-example-result-styles.css";
import "../universal-styles.css";

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
        <StringWithHanja string={result["kw_first_definition"]} />
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
