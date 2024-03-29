
import React from "react";

const HanjaResult = ({ result, clickFunction }) => {

  return (
    <div onClick = {() => {
      clickFunction(result["character"]);
    }}>
      {result["character"]}{' '}{result["meaning_reading"]}
    </div>
  );
}

export default HanjaResult;