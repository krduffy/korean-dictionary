import React, { useState } from "react";
import { useAPIModifier } from "../useAPIModifier.js";
import "./styles/korean-word-view-styles.css";

const KnowStudyToggles = ({ targetCode, initiallyKnown, initiallyStudied }) => {
  const [wordIsKnown, setWordIsKnown] = useState(initiallyKnown);
  const [wordIsStudied, setWordIsStudied] = useState(initiallyStudied);

  return (
    <>
      <KnownOrUnknownView
        targetCode={targetCode}
        wordIsKnown={wordIsKnown}
        setWordIsKnown={setWordIsKnown}
      />
      <StudiedOrNotStudiedView
        targetCode={targetCode}
        wordIsStudied={wordIsStudied}
        setWordIsStudied={setWordIsStudied}
      />
    </>
  );
};

export default KnowStudyToggles;

const KnownOrUnknownView = ({ targetCode, wordIsKnown, setWordIsKnown }) => {
  const { apiModify, successful, response, error } = useAPIModifier({});

  return (
    <span
      className="word-extra-info"
      style={{ cursor: "pointer" }}
      onClick={() => {
        const method = wordIsKnown ? "DELETE" : "PUT";
        setWordIsKnown(!wordIsKnown);
        apiModify(
          `http://127.0.0.1:8000/api/toggle_word_known/${targetCode}`,
          "",
          method,
        );
      }}
    >
      {wordIsKnown ? "아는  단어" : "모르는 단어"}
    </span>
  );
};

const StudiedOrNotStudiedView = ({
  targetCode,
  wordIsStudied,
  setWordIsStudied,
}) => {
  const { apiModify, successful, response, error } = useAPIModifier({});

  return (
    <span
      className="word-extra-info"
      style={{ cursor: "pointer" }}
      onClick={() => {
        const method = wordIsStudied ? "DELETE" : "PUT";
        setWordIsStudied(!wordIsStudied);
        apiModify(
          `http://127.0.0.1:8000/api/toggle_word_studied/${targetCode}`,
          "",
          method,
        );
      }}
    >
      {wordIsStudied ? "공부" : "비공부"}
    </span>
  );
};
