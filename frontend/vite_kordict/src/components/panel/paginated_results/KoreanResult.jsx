import React from "react";

import PropTypes from "prop-types";

import { getBasicDetailKoreanView } from "../../../../util/viewUtils.js";

import KnowStudyToggles from "../detail_view/KnowStudyToggles.jsx";
import Href from "../string_formatters/Href.jsx";
import PanelSpecificClickableText from "../string_formatters/PanelSpecificClickableText.jsx";
import StringWithHanja from "../string_formatters/StringWithHanja.jsx";
import StringWithNLP from "../string_formatters/StringWithNLP.jsx";

import "./styles/korean-result-styles.css";

const KoreanResult = ({ result }) => {
    return (
        <div className="result_box">
            <div className="header">
                <div>
                    <span className="word_header clickable-result">
                        <PanelSpecificClickableText
                            text={result.word}
                            viewOnPush={getBasicDetailKoreanView(
                                result.word,
                                result.target_code
                            )}
                        />
                    </span>

                    {"   "}

                    {result.origin && (
                        <StringWithHanja string={result.origin} />
                    )}
                </div>

                <div>
                    {result["user_data"] && (
                        <span className="korean-result-know-study-container">
                            <KnowStudyToggles
                                targetCode={result["target_code"]}
                                initiallyKnown={result["user_data"]["is_known"]}
                                initiallyStudied={
                                    result["user_data"]["is_studied"]
                                }
                            />
                        </span>
                    )}
                </div>
            </div>

            <ul className="listed_senses">
                {result.senses.map((sense) => (
                    <li key={sense.order}>
                        {sense.order}.{" "}
                        <span style={{ color: "#8e44ad" }}>{sense.pos}</span>{" "}
                        <span style={{ color: "#3498db" }}>
                            {sense.category}
                        </span>{" "}
                        <StringWithNLP string={sense.definition} />
                    </li>
                ))}
            </ul>

            <p className="source">
                출처:{" "}
                <Href
                    link={`https://opendict.korean.go.kr/search/searchResult?&query=${result.word}`}
                    innerText={"우리말샘"}
                />
            </p>
        </div>
    );
};

KoreanResult.propTypes = {
    result: PropTypes.shape({
        target_code: PropTypes.number.isRequired,
        word: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired,
        senses: PropTypes.arrayOf(
            PropTypes.shape({
                order: PropTypes.number.isRequired,
                pos: PropTypes.string.isRequired,
                category: PropTypes.string.isRequired,
                definition: PropTypes.string.isRequired,
            })
        ).isRequired,
        user_data: PropTypes.shape({
            is_known: PropTypes.bool,
            is_studied: PropTypes.bool,
            created_by_user: PropTypes.bool,
        }),
    }).isRequired,
};

export default KoreanResult;
