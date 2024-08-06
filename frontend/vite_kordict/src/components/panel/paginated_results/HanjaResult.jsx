import React from "react";

import PropTypes from "prop-types";

import { getBasicDetailHanjaView } from "../../../../util/viewUtils.js";

import Href from "../string_formatters/Href.jsx";
import PanelSpecificClickableText from "../string_formatters/PanelSpecificClickableText.jsx";

import "./styles/hanja-result-styles.css";

const HanjaResult = ({ result }) => {
    return (
        <div className="hanja-result-container">
            <div className="hanja-result-top">
                <div style={{ width: "60%" }}>
                    <div className="hanja-clickable-result">
                        <PanelSpecificClickableText
                            text={result["character"]}
                            viewOnPush={getBasicDetailHanjaView(
                                result.character
                            )}
                        />
                    </div>

                    <div className="meaning-reading">
                        {result["meaning_reading"]}
                    </div>
                </div>

                <div style={{ width: "20%" }}>{result["exam_level"]}</div>
                <div style={{ width: "20%" }}>{result["strokes"]}획</div>
            </div>
            <div className="hanja-result-bottom">
                <div className="single-line-ellipsis">
                    {result["explanation"]}
                </div>
            </div>
            <div className="source">
                출처:{" "}
                <Href
                    link={`https://namu.wiki/w/${result["character"]}`}
                    innerText={"나무위키"}
                />
            </div>
        </div>
    );
};

HanjaResult.propTypes = {
    result: PropTypes.shape({
        character: PropTypes.string.isRequired,
        meaning_reading: PropTypes.string.isRequired,
    }).isRequired,
};

export default HanjaResult;
