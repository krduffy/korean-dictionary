import { useAPIModifier } from "../../../hooks/useAPIModifier";
import { ViewContext } from "../Panel";
import StringWithHanja from "./StringWithHanja";

import React, { useContext, useEffect, useState } from "react";

import "./universal-styles.css";

/* Also links string with hanja functionality into the string */
const StringWithNLP = ({ string, hasExamples }) => {
    const getSentences = (stringWithSentences) => {
        let sentences = stringWithSentences.split(/\.\s/g);
        sentences[sentences.length - 1] = sentences[
            sentences.length - 1
        ].replace(".", "");
        return sentences;
    };

    const getWords = (stringWithWords) => {
        if (!hasExamples) {
            return stringWithWords.split(/\s/g);
        }

        /* if there are examples, then an example is considered a single word
       even if it is a phrase that really consists of several words. */
        const tokens = stringWithWords.split(/\s/g);
        let words = [];
        let capturingExample = false;

        for (let i = 0; i < tokens.length; i++) {
            if (capturingExample) {
                if (tokens[i].endsWith("}")) {
                    capturingExample = false;
                }
                words[words.length - 1] =
                    words[words.length - 1] +
                    tokens[i] +
                    (capturingExample ? " " : "");
            } else if (tokens[i].startsWith("{") && !tokens[i].endsWith("}")) {
                capturingExample = true;
                words.push(tokens[i] + " ");
            } else {
                words.push(tokens[i]);
            }
        }

        return words;
    };

    return (
        <span className="string-with-nlp">
            {/* split into individual sentences */}

            {getSentences(string).map((sentence, sentenceId, sentenceArray) => (
                <span className="sentence-with-nlp" key={sentenceId}>
                    {getWords(sentence.replaceAll("ㆍ", " ㆍ ")).map(
                        (word, wordId, wordArray) => (
                            <React.Fragment key={wordId}>
                                {word === "ㆍ" ? (
                                    <span>ㆍ</span>
                                ) : (
                                    <React.Fragment>
                                        {hasExamples && word.match(/{.*?}/) ? (
                                            <span className="bracketed-word-from-example">
                                                {word.substring(
                                                    1,
                                                    word.length - 1
                                                )}
                                            </span>
                                        ) : (
                                            <WordWithNLP
                                                word={word}
                                                fullSentence={sentence
                                                    .replaceAll("ㆍ", " ㆍ ")
                                                    .replaceAll(
                                                        /{(.*?)}/g,
                                                        "$1"
                                                    )}
                                            />
                                        )}
                                        {wordArray[wordId + 1] !== "ㆍ" &&
                                            wordId < wordArray.length - 1 && (
                                                <span> </span>
                                            )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )
                    )}
                    <span>
                        .{sentenceId < sentenceArray.length - 1 ? " " : ""}
                    </span>
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

    const splitBulleted = (sentenceString) => {
        /* 전기를 일으키는 시설을 갖춘 곳 
       수력ㆍ화력ㆍ원자력ㆍ풍력ㆍ조력ㆍ태양광ㆍ지열 
       따위로 발전기를 돌려 전기를 일으킨다.

       ^ a string like this where there are a bunch of nouns separated by no space but instead a 
      ㆍ are annoying to click on because it is all considered one word. so here, they are split
      with spaces. 
     */
        return sentenceString.replace("ㆍ", " ㆍ ");
    };

    const currentView = useContext(ViewContext)["currentView"];

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

        apiModify(
            "http://127.0.0.1:8000/api/korean_word_lemma/",
            formData,
            "POST"
        );
    };

    const alreadyViewing = (koreanWord) => {
        if (
            currentView["view"] === "search_korean" &&
            currentView["value"] === koreanWord
        ) {
            return true;
        } else if (
            currentView["view"] === "detail_korean" &&
            currentView["searchBarInitialState"]["boxContent"] === koreanWord
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (response) {
            if (response.found) {
                if (!alreadyViewing(response.found)) {
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
        }
    }, [response]);

    useEffect(() => {
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
            </span>
        </React.Fragment>
    );
};
