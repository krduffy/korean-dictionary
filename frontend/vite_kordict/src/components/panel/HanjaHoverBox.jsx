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
      })
      .catch((error) => {
        console.error("Error while fetching results: ", error);
      });
  }, [character]);

  return <div className="hanja-hover-box">{hoverBoxData}</div>;
};

HanjaHoverBox.propTypes = {
  character: PropTypes.string.isRequired,
};

export default HanjaHoverBox;
