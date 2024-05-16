import React, { useState, useEffect } from "react";
import { useAPIModifier } from "../useAPIModifier.js";
import "./styles/korean-word-view-styles.css";

const KnowStudyToggles = ({ targetCode, initiallyKnown, initiallyStudied }) => {
  return (
    <>
      <KnownOrUnknownView
        targetCode={targetCode}
        initiallyKnown={initiallyKnown}
      />
      <StudiedOrNotStudiedView
        targetCode={targetCode}
        initiallyStudied={initiallyStudied}
      />
    </>
  );
};

export default KnowStudyToggles;

const KnownOrUnknownView = ({ targetCode, initiallyKnown }) => {
  const { apiModify, successful, response, error } = useAPIModifier({});
  const [wordIsKnown, setWordIsKnown] = useState(initiallyKnown);

  useEffect(() => {
    setWordIsKnown(initiallyKnown);
  }, [initiallyKnown]);

  const handleClick = () => {
    const method = wordIsKnown ? "DELETE" : "PUT";
    setWordIsKnown(!wordIsKnown);
    apiModify(
      `http://127.0.0.1:8000/api/toggle_word_known/${targetCode}`,
      "",
      method,
    );
  };

  return (
    <span
      className={wordIsKnown ? "known-word-button" : "unknown-word-button"}
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleClick();
      }}
    >
      {wordIsKnown ? "★" : "☆"}
    </span>
  );
};

const StudiedOrNotStudiedView = ({ targetCode, initiallyStudied }) => {
  const { apiModify, successful, response, error } = useAPIModifier({});
  const [wordIsStudied, setWordIsStudied] = useState(initiallyStudied);

  useEffect(() => {
    setWordIsStudied(initiallyStudied);
  }, [initiallyStudied]);

  const handleClick = () => {
    const method = wordIsStudied ? "DELETE" : "PUT";
    setWordIsStudied(!wordIsStudied);
    apiModify(
      `http://127.0.0.1:8000/api/toggle_word_studied/${targetCode}`,
      "",
      method,
    );
  };

  return (
    <span
      className={
        wordIsStudied ? "studied-word-button" : "not-studied-word-button"
      }
      style={{ cursor: "pointer" }}
      onClick={() => {
        handleClick();
      }}
    >
      {wordIsStudied ? "암기" : "비암기"}
    </span>
  );
};
