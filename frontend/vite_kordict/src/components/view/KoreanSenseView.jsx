

import React from "react";

const KoreanSenseView = ({ senseData }) => {

  return (
    <div>
      <div>{senseData["target_code"]}</div>
      <div>{senseData["definition"]}</div>
      <div>{senseData["type"]}</div>
      <div>{senseData["order"]}</div>
      <div>{senseData["category"]}</div>
      <div>{senseData["pos"]}</div>

      <div>

      </div>
    </div>
  );
}

export default KoreanSenseView;