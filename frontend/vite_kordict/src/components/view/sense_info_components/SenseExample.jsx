
import React from "react";

const SenseExample = ({ exampleData }) => {

  return (
    <div className="example-container">
      <div>{exampleData["example"]}</div>
      {exampleData["source"] && (
        <div>출처: {exampleData["source"]}</div>
      )}
    </div>
  );
}

export default SenseExample;