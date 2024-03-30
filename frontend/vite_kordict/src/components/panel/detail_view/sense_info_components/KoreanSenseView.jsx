

import React from "react";

import SenseExample from "./SenseExample.jsx";
import StringWithHanja from "../../StringWithHanja.jsx";
import "./styles/korean-sense-styles.css";

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
        <StringWithHanja stringWithHanja={senseData["definition"]} />
      </div>

      {/* is a drop down menu because there can be a lot of data*/}
      <div className="sense-additional-data">
        
        {senseData["additional_info"]["example_info"] && (
          <ul className="sense-example-list">
            {senseData["additional_info"]["example_info"].map((ex, id) =>
              <li key={id} className="sense-example-list-item">
                <SenseExample exampleData={ex} />
              </li>
            )}
          </ul>
        )} 

      </div>

    </div>
  );
}

export default KoreanSenseView;