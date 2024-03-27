
import React from "react";
import "./sense-info-styles.css"

const SenseExample = ({ exampleData }) => {

  const removeBrackets = (word) => {
    return word.replace(/{(.*?)}/g, '$1');
  }

  return (
    <div className="example-container">
      <div className="example-text">
        {exampleData["example"].split(" ").map((word, id) => (
          <span className={word.match(/{.*?}/) ? "bracketed-word" : ""} key={id}>
            {removeBrackets(word)}{' '}
          </span>
        ))}
      </div>
      {exampleData["source"] && (
        <div className="example-source">출처: {exampleData["source"]}</div>
      )}
    </div>
  );
}

export default SenseExample;