import React, { useContext } from "react";
import PropTypes from "prop-types";
import { UpdateHistoryContext, ViewContext } from "../Panel";
import "../universal-styles.css";

const HanjaResult = ({ result }) => {
  const viewContext = useContext(ViewContext);
  const setHistoryNeedsUpdating = useContext(UpdateHistoryContext);

  const viewHanjaDetail = (character) => {
    viewContext["setCurrentView"]({
      view: "detail_hanja",
      value: character,
    });
    setHistoryNeedsUpdating(true);
  };

  return (
    <div>
      <span
        className="clickable-result"
        onClick={() => {
          viewHanjaDetail(result["character"]);
        }}
      >
        {result["character"]} {result["meaning_reading"]}
      </span>
    </div>
  );
};

HanjaResult.propTypes = {
  result: PropTypes.shape({
    character: PropTypes.string.isRequired,
    meaning_reading: PropTypes.string.isRequired,
    // Add more specific PropTypes for other properties if needed
  }).isRequired,
};

export default HanjaResult;
