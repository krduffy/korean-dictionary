import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PaginatedResults from "../paginated_results/PaginatedResults.jsx";
import "./styles/hanja-char-view-styles.css";

const HanjaCharView = ({ hanjaChar }) => {
  const [charData, setCharData] = useState({});

  useEffect(() => {
    const char_Url = `http://127.0.0.1:8000/api/hanja_char/${hanjaChar}`;
    fetch(char_Url)
      .then((response) => response.json())
      .then((data) => {
        setCharData(data);
      })
      .catch((error) => {
        console.error("Error while fetching results: ", error);
      });
  }, [hanjaChar]);

  return (
    <div>
      {charData && (
        <div className="jahuneum">
          <span className="hanja-header">{charData["character"]}</span>{" "}
          <span className="meaning-reading-header">
            {charData["meaning_reading"]}
          </span>
        </div>
      )}

      <div className="word-list-header">연관단어 검색</div>
      <div className="example-container">
        <PaginatedResults
          searchType="search_hanja_examples"
          searchTerm={hanjaChar}
          functions={null}
        />
      </div>
    </div>
  );
};

HanjaCharView.propTypes = {
  hanjaChar: PropTypes.string.isRequired,
};

export default HanjaCharView;
