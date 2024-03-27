

import React from "react";

import SenseExample from "./sense_info_components/SenseExample.jsx";

const KoreanSenseView = ({ senseData }) => {

  return (
    <div>
      <div className="sense-main-data">
        {senseData["order"]}.{' '}
        <span>{senseData["type"]}</span>
        {senseData["additional_info"]["region_info"] && (
          <span>{senseData["additional_info"]["region_info"]["region"]}{' '}</span>
        )}
        <span style={{ color: '#8e44ad' }}>{senseData["pos"]}</span>{' '}
        <span style={{ color: '#3498db' }}>{senseData["category"]}</span>{' '}
        {senseData["definition"]}
      </div>

      {/* is a drop down menu because there can be a lot of data*/}
      <div className="sense-additional-data">
        
        {senseData["additional_info"]["example_info"] && (
              <div className="sense-example-container">
                {senseData["additional_info"]["example_info"].map((ex, id) =>
                  <SenseExample key={id} exampleData={ex} />)}
              </div>
        )}
      
      
      </div>

    </div>
  );
}

export default KoreanSenseView;