import React from "react";

import PropTypes from "prop-types";

import { getBasicDetailKoreanView } from "../../../../util/viewUtils.js";

import Href from "../string_formatters/Href.jsx";
import PanelSpecificClickableText from "../string_formatters/PanelSpecificClickableText.jsx";
import StringWithHanja from "../string_formatters/StringWithHanja.jsx";
import StringWithNLP from "../string_formatters/StringWithNLP.jsx";

import "./styles/hanja-example-result-styles.css";

const HanjaExampleResult = ({ result }) => {
    return (
        <div>
            <div className="hanja_example_word">
                <PanelSpecificClickableText
                    text={result["word"]}
                    viewOnPush={getBasicDetailKoreanView(
                        result["word"],
                        result["target_code"]
                    )}
                />
                (
                <StringWithHanja string={result["origin"]} />)
            </div>

            <div className="hanja_example_definition">
                <StringWithNLP
                    string={result["first_definition"]}
                    hasExamples={false}
                />
            </div>

            <div className="source">
                출처:{" "}
                <Href
                    link={`https://opendict.korean.go.kr/search/searchResult?&query=${result.origin}`}
                    innerText={"우리말샘"}
                />
            </div>
        </div>
    );
};

HanjaExampleResult.propTypes = {
    result: PropTypes.shape({
        target_code: PropTypes.number.isRequired,
        word: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired,
        first_definition: PropTypes.string.isRequired,
    }).isRequired,
};

export default HanjaExampleResult;
