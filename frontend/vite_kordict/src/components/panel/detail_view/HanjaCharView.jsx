import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginatedResults from "../paginated_results/PaginatedResults.jsx";
import { useAPIFetcher } from "../useAPIFetcher.js";
import { LoadingMessage } from "../../LoadingMessage.jsx";
import "./styles/hanja-char-view-styles.css";

const HanjaCharView = ({ hanjaChar }) => {
  const [charData, setCharData] = useState({});
  const { apiFetch, loading, error } = useAPIFetcher();

  useEffect(() => {
    apiFetch(`http://127.0.0.1:8000/api/hanja_char/${hanjaChar}`, setCharData);
  }, [hanjaChar]);

  return (
    <>
      {loading ? (
        <LoadingMessage />
      ) : (
        <div>
          <div className="jahuneum">
            <span className="hanja-header">{charData["character"]}</span>{" "}
            <span className="meaning-reading-header">
              {charData["meaning_reading"]}
            </span>
          </div>
          <div className="additional-info-section-header">연관단어</div>
          <div className="example-container">
            <PaginatedResults
              searchType="search_hanja_examples"
              searchTerm={hanjaChar}
              functions={null}
            />
          </div>
        </div>
      )}
    </>
  );
};

HanjaCharView.propTypes = {
  hanjaChar: PropTypes.string.isRequired,
};

export default HanjaCharView;
