import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const HanjaHoverBox = ({ character }) => {
  const [hoverBoxData, setHoverBoxData] = useState({});

  useEffect(() => {
    const apiUrl =
      `http://127.0.0.1:8000/api/hanja_popup_view/?` + `character=${character}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setHoverBoxData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error while fetching results: ", error);
      });
  }, [character]);

  return (
    <div className="hanja-hover-box">
      <div className="meaning-reading-section">
        <span>
          {character}
          {}
          {hoverBoxData["meaning_reading"]}
        </span>
      </div>
      <KoreanWordSection hoverBoxData={hoverBoxData} />
    </div>
  );
};

HanjaHoverBox.propTypes = {
  character: PropTypes.string.isRequired,
};

/* highlighting hanja char that is same would be maybe nice touch; can also do in hanja results
when paginatedresults are shown */
const KoreanWordSection = (hoverBoxData) => {
  return (
    <div className="korean-word-section">
      {hoverBoxData["retrieved_words"] > 0 ? (
        hoverBoxData["words"].map((wordData, id) => (
          <div key={id}>{wordData["kw_origin"]}</div>
        ))
      ) : (
        <div>연관단어가 없습니다.</div>
      )}
    </div>
  );
};

export default HanjaHoverBox;
