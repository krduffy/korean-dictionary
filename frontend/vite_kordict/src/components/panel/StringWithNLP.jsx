import React, { useState, useContext, useEffect } from "react";
import { ViewContext } from "./Panel";
import { useAPIModifier } from "./useAPIModifier";
import StringWithHanja from "./StringWithHanja";
import "./universal-styles.css";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [showErrorBox, setShowErrorBox] = useState(false);

  {
    /* does not actually modify but needs to make post request because full sentence
      can become too long to store in a url for a get request. none of the form data
      are ever changed*/
  }
  const { formData, apiModify, successful, response, error, loading } =
    useAPIModifier({
      sentence: fullSentence,
      mouse_over: word,
    });

  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];

  const fixBoxXToScreen = (x) => {
    return x > window.innerWidth / 2 ? x - 220 : x + 20;
  };

  const fixBoxYToScreen = (y) => {
    return y > window.innerHeight / 2 ? y - 220 : y + 20;
  };

  const handleClick = (e) => {
    e.preventDefault();
    setMousePosition({ x: e.clientX, y: e.clientY });

    apiModify("http://127.0.0.1:8000/api/korean_word_lemma/", formData, "POST");
  };

  useEffect(() => {
    if (response) {
      if (response.found) {
        updateViewAndPushToHistory({
          view: "search_korean",
          value: response.found,
          searchBarInitialState: {
            boxContent: response.found,
            dictionary: "korean",
          },
        });
      }
    }
  }, [response]);

  useEffect(() => {
    console.log(error);
    if (error) {
      setShowErrorBox(true);

      setTimeout(() => {
        setShowErrorBox(false);
      }, 2500);
    }
  }, [error]);

  return (
    <React.Fragment>
      <span
        className={mouseInside ? "clickable-result" : ""}
        onMouseOver={() => {
          setMouseInside(true);
        }}
        onMouseOut={() => {
          setMouseInside(false);
        }}
        onClick={handleClick}
      >
        <StringWithHanja string={word} />
      </span>
      <span>
        {loading && (
          <div
            className="nlp-loading-indicator"
            style={{
              position: "absolute",
              left: fixBoxXToScreen(mousePosition.x),
              top: fixBoxYToScreen(mousePosition.y),
            }}
          />
        )}
        {showErrorBox && (
          <div
            className="nlp-error-message"
            style={{
              position: "absolute",
              left: fixBoxXToScreen(mousePosition.x),
              top: fixBoxYToScreen(mousePosition.y),
            }}
          >
            {response.errors}
          </div>
        )}
      </span>{" "}
    </React.Fragment>
  );
};
