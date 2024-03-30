import React from "react";
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

export default SenseExample;
