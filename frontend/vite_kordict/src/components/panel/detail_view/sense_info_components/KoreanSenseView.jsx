import React from "react";
import SenseExampleInfo from "./SenseExampleInfo.jsx";
import SenseProverbInfo from "./SenseProverbInfo.jsx";
import StringWithHanja from "../../StringWithHanja.jsx";
import "./styles/korean-sense-styles.css";

import PropTypes from "prop-types";

const KoreanSenseView = ({ senseData }) => {
  return (
    <div>
      <div className="sense-main-data">
        {senseData["order"]}. <span>{senseData["type"]}</span>
        {senseData["additional_info"]["region_info"] && (
          <span>{senseData["additional_info"]["region_info"]["region"]} </span>
        )}
        <span style={{ color: "#8e44ad" }}>{senseData["pos"]}</span>{" "}
        <span style={{ color: "#3498db" }}>{senseData["category"]}</span>{" "}
        <StringWithHanja string={senseData["definition"]} />
      </div>

      {/* is a drop down menu because there can be a lot of data*/}
      {senseData["additional_info"] && (
        <div className="sense-additional-data">
          {senseData["additional_info"]["example_info"] && (
            <SenseExampleInfo
              exampleInfo={senseData["additional_info"]["example_info"]}
            />
          )}

          {senseData["additional_info"]["proverb_info"] && (
            <SenseProverbInfo
              proverbInfo={senseData["additional_info"]["proverb_info"]}
            />
          )}
        </div>
      )}
    </div>
  );
};

/* Representation of sense can be found in korean-dictionary/api/management/dict_files/json_structure.txt */
KoreanSenseView.propTypes = {
  senseData: PropTypes.shape({
    order: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    pos: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    additional_info: PropTypes.shape({
      region_info: PropTypes.shape({
        region: PropTypes.string,
      }),
      example_info: PropTypes.arrayOf(PropTypes.shape({})),
      proverb_info: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
};

export default KoreanSenseView;
