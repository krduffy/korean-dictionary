import { getBasicSearchKoreanView } from "../../../../util/viewUtils";
import { AuthenticationInfoContext } from "../../../App";
import { useAPIModifier } from "../../../hooks/useAPIModifier";
import { ViewContext } from "../Panel";
import ErrorMessage from "../messages/ErrorMessage";
import {
    LoadingMessage,
    TrailingDotCustomMessage,
} from "../messages/LoadingMessage";
import PanelSpecificClickableText from "./PanelSpecificClickableText";
import PopupBox from "./PopupBox";
import StringWithHanja from "./StringWithHanja";

import React, { useContext, useEffect, useState } from "react";

import "./universal-styles.css";

/* Also links string with hanja functionality into the string */
const StringWithNLP = ({ string, hasExamples }) => {
    const getSentences = (stringWithSentences) => {
        let sentences = stringWithSentences.split(/(?<=\.)\s+/);

        return sentences;
    };

    const getWords = (stringWithWords) => {
        if (!hasExamples) {
            return stringWithWords.split(/\s/g);
        }

        /* if there are examples, then an example is considered a single word
       even if it is a phrase that really consists of several words. */
        const splitAlongCurly = stringWithWords.split(/({.*?})/g);
        let words = [];

        for (let i = 0; i < splitAlongCurly.length; i++) {
            if (splitAlongCurly[i].match(/{.*}/)) {
                words.push(splitAlongCurly[i]);
            } else {
                for (const word of splitAlongCurly[i].split(/\s/g)) {
                    words.push(word);
                }
            }
        }

        return words.filter((word) => word.length > 0);
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
                                        {wordId != 0 &&
                                            wordArray[wordId - 1] !== "ㆍ" &&
                                            !word.match(/^[.,!?]*$/) &&
                                            " "}
                                        {hasExamples && word.match(/{.*?}/) ? (
                                            <span className="underlined">
                                                {word.substring(
                                                    1,
                                                    word.length - 1
                                                )}
                                            </span>
                                        ) : word.match(/^[.,!?]*$/) ? (
                                            <span>{word}</span>
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
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )
                    )}
                    {sentenceId < sentenceArray.length - 1 && " "}
                </span>
            ))}
        </span>
    );
};

export default StringWithNLP;

const WordWithNLP = ({ word, fullSentence }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const [showErrorBox, setShowErrorBox] = useState(false);

    /* does not actually modify but needs to make post request because full sentence
       can become too long to store in a url for a get request. none of the form data
       are ever changed*/
    const { formData, apiModify, successful, response, error, loading } =
        useAPIModifier(true, {
            text: fullSentence,
            mouse_over: word,
        });

    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    /*
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
    */

    const getViewOnPush = async () => {
        const response = await apiModify(
            "api/korean_word_lemma/",
            authInfo["token"],
            formData,
            "POST"
        );

        if (response?.found) {
            return getBasicSearchKoreanView(response.found);
        }

        /* does nothing since changing view to the same one is blocked */
        return null;
    };

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
            <PanelSpecificClickableText
                getViewOnPush={async () => {
                    const view = await getViewOnPush();
                    return view;
                }}
            >
                <StringWithHanja string={word} />
            </PanelSpecificClickableText>

            <span>
                {loading && (
                    <NLPLoadingIndicator
                        fromX={mousePosition.x}
                        fromY={mousePosition.y}
                    />
                )}
                {showErrorBox && (
                    <NLPErrorMessage
                        fromX={mousePosition.x}
                        fromY={mousePosition.y}
                        errorResponse={response}
                    />
                )}
            </span>
        </React.Fragment>
    );
};

const NLPLoadingIndicator = ({ fromX, fromY }) => {
    const [showIndicator, setShowIndicator] = useState(false);

    /* looks strange if it shows up for a split second on fast returns */
    useEffect(() => {
        setTimeout(() => {
            setShowIndicator(true);
        }, 250);
    }, []);

    return (
        showIndicator && (
            <PopupBox
                fromX={fromX}
                fromY={fromY}
                padding={10}
                positioning="fit"
            >
                <div style={{ fontSize: "20px" }}>
                    <TrailingDotCustomMessage
                        customMessage={"단어를 찾는 중"}
                    />
                </div>
            </PopupBox>
        )
    );
};

const NLPErrorMessage = ({ fromX, fromY, errorResponse }) => {
    return (
        <PopupBox fromX={fromX} fromY={fromY} padding={10} positioning="fit">
            <div style={{ fontSize: "20px" }}>
                <ErrorMessage errorResponse={errorResponse} />
            </div>
        </PopupBox>
    );
};
