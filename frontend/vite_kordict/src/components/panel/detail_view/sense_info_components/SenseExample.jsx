import React from "react";
import PropTypes from "prop-types";
import "./styles/korean-sense-styles.css";

const SenseExample = ({ exampleData }) => {
  return (
    <div className="example-container">
      <ExampleTextWithHighlighting string={exampleData["example"]} />

      {exampleData["source"] && (
        <div className="example-source">출처: {exampleData["source"]}</div>
      )}
    </div>
  );
};

SenseExample.propTypes = {
  exampleData: PropTypes.shape({
    example: PropTypes.string.isRequired,
    source: PropTypes.string, // Source is optional
  }).isRequired,
};

const ExampleTextWithHighlighting = ({ string }) => {
  const isolateBrackets = (text) => {
    return text.split(/({.*?})/g).filter((str) => str.length > 0);
  };

  return (
    <span className="example-text">
      {isolateBrackets(string).map((substring, id) => (
        <span
          className={substring.match(/{.*?}/) ? "bracketed-word" : ""}
          key={id}
        >
          {substring.replace(/{(.*?)}/g, "$1")}{" "}
        </span>
      ))}
    </span>
  );
};

ExampleTextWithHighlighting.propTypes = {
  string: PropTypes.string.isRequired,
};

export default SenseExample;
