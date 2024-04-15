import React, { useState, useEffect } from "react";
import { useAPIFetcher } from "./useAPIFetcher";
import PropTypes from "prop-types";
import "./universal-styles.css";

const HanjaHoverBox = ({ character, x, y }) => {
  const [hoverBoxData, setHoverBoxData] = useState({});
  const { apiFetch, loading, error } = useAPIFetcher();

  useEffect(() => {
    const apiUrl = apiFetch(
      `http://127.0.0.1:8000/api/hanja_popup_view/?` + `character=${character}`,
      setHoverBoxData,
    );
  }, [character]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
          }}
        >
          <div className="hanja-hover-box">
            {hoverBoxData && (
              <div>
                <div className="meaning-reading-section">
                  <span>
                    {character} {hoverBoxData["meaning_reading"]}
                  </span>
                </div>

                {hoverBoxData["retrieved_words"] > 0 ? (
                  <KoreanWordSection wordArray={hoverBoxData["words"]} />
                ) : (
                  <div>
                    연관단어가 없습니다.{hoverBoxData["retrieved_words"]}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

HanjaHoverBox.propTypes = {
  character: PropTypes.string.isRequired,
};

/* highlighting hanja char that is same would be maybe nice touch; can also do in hanja results
when paginatedresults are shown */
const KoreanWordSection = ({ wordArray }) => {
  return (
    <div className="korean-word-section">
      {wordArray.map((wordData, id) => (
        <div key={id} className="single-hanja-example">
          {wordData["kw_word"]} {wordData["kw_origin"]}
        </div>
      ))}
    </div>
  );
};

export default HanjaHoverBox;
