
import React from "react";
import "../universal-styles.css";

const HanjaResult = ({ result, clickFunction }) => {

  return (
    <div>
      <span className="clickable-result"
            onClick = {() => {
              clickFunction(result["character"]);
            }}>
        
        {result["character"]}{' '}{result["meaning_reading"]}
      
      </span>
    </div>
  );
}

export default HanjaResult;