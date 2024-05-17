import React, { useState, useContext, useEffect } from "react";
import { ViewContext } from "./Panel";
import { useAPIModifier } from "./useAPIModifier";

const StringWithNLP = ({ string, linkHanja }) => {
  const getSentences = (stringWithSentences) => {
    return stringWithSentences.split(/\.\s/g);
  };

  const getWords = (stringWithWords) => {
    return stringWithWords.split(/\s/g);
  };

  return (
    <span className="string-with-nlp">
      {/* split into individual sentences */}

      {getSentences(string).map((sentence, sentenceId) => (
        <span className="sentence-with-nlp" key={sentenceId}>
          {getWords(sentence).map((word, wordId) => (
            <React.Fragment key={wordId}>
              <WordWithNLP word={word} fullSentence={sentence} />{" "}
            </React.Fragment>
          ))}
        </span>
      ))}
    </span>
  );
};

export default StringWithNLP;

const WordWithNLP = ({ word, fullSentence }) => {
  const [mouseInside, setMouseInside] = useState(false);

  {
    /* does not actually modify but needs to make post request because full sentence
      can become too long to store in a url for a get request. none of the form data
      are ever changed*/
  }
  const { formData, apiModify, successful, response, error } = useAPIModifier({
    sentence: fullSentence,
    mouse_over: word,
  });

  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];

  const handleClick = (e) => {
    e.preventDefault();

    apiModify("http://127.0.0.1:8000/api/korean_word_lemma/", formData, "POST");
  };

  useEffect(() => {
    if (response) {
      console.log(response);
    }
  }, [response]);

  return (
    <span
      className={mouseInside ? "clickable-result" : ""}
      onMouseEnter={() => {
        setMouseInside(true);
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}
      onClick={handleClick}
    >
      {word}
    </span>
  );
};
