import React, { useContext } from "react";

import PropTypes from "prop-types";

import { ViewContext } from "../Panel.jsx";
import Href from "../string_formatters/Href.jsx";

import "./styles/hanja-result-styles.css";

const HanjaResult = ({ result }) => {
    const viewContext = useContext(ViewContext);

    const viewHanjaDetail = (character) => {
        viewContext["updateViewAndPushToHistory"]({
            view: "detail_hanja",
            value: character,
            searchBarInitialState: {
                boxContent: character,
                dictionary: "hanja",
            },
        });
    };

    return (
        <div className="hanja-result-container">
            <div className="hanja-result-top">
                <div style={{ width: "60%" }}>
                    <div
                        className="hanja-clickable-result"
                        onClick={() => {
                            viewHanjaDetail(result["character"]);
                        }}
                    >
                        {result["character"]}
                    </div>

                    <div className="meaning-reading">
                        {result["meaning_reading"]}
                    </div>
                </div>

                <div style={{ width: "20%" }}>{result["exam_level"]}</div>
                <div style={{ width: "20%" }}>{result["strokes"]}획</div>
            </div>
            <div className="hanja-result-bottom">{result["explanation"]}</div>
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
