
import React from "react";

const HanjaResult = ({ result }) => {

  return (
    <div>
      {result["character"]}
      {result["meaning_reading"]}
    </div>
  );
}

export default HanjaResult;