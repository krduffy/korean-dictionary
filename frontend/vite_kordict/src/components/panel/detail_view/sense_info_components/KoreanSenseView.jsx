import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import StringWithNLP from "../../string_formatters/StringWithNLP.jsx";
import SenseExampleInfo from "./SenseExampleInfo.jsx";
import SenseGrammarInfo from "./SenseGrammarInfo.jsx";
import SenseNormInfo from "./SenseNormInfo.jsx";
import SenseProverbInfo from "./SenseProverbInfo.jsx";
import SenseRelationInfo from "./SenseRelationInfo.jsx";

import "./styles/korean-sense-styles.css";

const KoreanSenseView = ({ senseData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const additionalDataContentRef = useRef(null);

    useEffect(() => {
        if (additionalDataContentRef.current) {
            const contentHeight =
                additionalDataContentRef.current.getBoundingClientRect().height;
            setShowButton(contentHeight == 100);
        }
    }, [senseData]);

    return (
        <div>
            {senseData["order"] == 0 ? (
                <div className="user-example-container-header">
                    내가 추가한 예문
                </div>
            ) : (
                <div className="sense-main-data">
                    {senseData["order"]}.{" "}
                    <span style={{ color: "#47519e" }}>
                        「{senseData["type"]}」
                    </span>
                    {senseData["pos"] && (
                        <span style={{ color: "#8e44ad" }}>
                            「{senseData["pos"]}」
                        </span>
                    )}
                    {senseData["category"] && (
                        <span style={{ color: "#3498db" }}>
                            「{senseData["category"]}」
                        </span>
                    )}
                    {senseData["additional_info"]["pattern_info"] &&
                        senseData["additional_info"]["pattern_info"].map(
                            (pattern, id, patternArray) => (
                                <span key={id} style={{ color: "#42d1f5" }}>
                                    ≪{pattern.pattern}≫{" "}
                                </span>
                            )
                        )}
                    <StringWithNLP string={senseData["definition"]} />
                    {senseData["additional_info"]["region_info"] && (
                        <span>
                            <span> (</span>
                            {senseData["additional_info"]["region_info"].map(
                                (region, id, regionArray) => (
                                    <span key={id}>
                                        {region["region"]}
                                        {id + 1 < regionArray.length && ", "}
                                    </span>
                                )
                            )}
                            <span>)</span>
                        </span>
                    )}
                </div>
            )}

            {/* is a drop down menu because there can be a lot of data*/}
            {Object.keys(senseData["additional_info"]).length > 0 && (
                <div className="sense-additional-data">
                    <div className="expansion-controller">
                        <div
                            className={
                                showButton
                                    ? isExpanded
                                        ? "retract-line-shortened-expanded"
                                        : "retract-line-shortened-unexpanded"
                                    : "retract-line-unshortened"
                            }
                            onClick={() => setIsExpanded(false)}
                        ></div>
                        {showButton && (
                            <div
                                className="expand-button"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? "▲" : "▼"}
                            </div>
                        )}
                    </div>

                    <div
                        className={
                            isExpanded
                                ? "additional-data-content-entire"
                                : "additional-data-content-truncated"
                        }
                        ref={additionalDataContentRef}
                    >
                        {senseData["additional_info"]["example_info"] && (
                            <SenseExampleInfo
                                exampleInfo={
                                    senseData["additional_info"]["example_info"]
                                }
                            />
                        )}
                        {senseData["additional_info"]["grammar_info"] && (
                            <SenseGrammarInfo
                                grammarInfo={
                                    senseData["additional_info"]["grammar_info"]
                                }
                            />
                        )}
                        {senseData["additional_info"]["norm_info"] && (
                            <SenseNormInfo
                                normInfo={
                                    senseData["additional_info"]["norm_info"]
                                }
                            />
                        )}
                        {senseData["additional_info"]["relation_info"] && (
                            <SenseRelationInfo
                                relationInfo={
                                    senseData["additional_info"][
                                        "relation_info"
                                    ]
                                }
                            />
                        )}
                        {senseData["additional_info"]["proverb_info"] && (
                            <SenseProverbInfo
                                proverbInfo={
                                    senseData["additional_info"]["proverb_info"]
                                }
                            />
                        )}
                        {/*
            {senseData["additional_info"]["history_info"] && (
              <SenseHistoryInfo
                historyInfo={senseData["additional_info"]["history_info"]}
              />
            )} */}
                    </div>
                </div>
            )}
        </div>
    );
};

/* Representation of sense can be found in korean-dictionary/api/management/dict_files/json_structure.txt */
KoreanSenseView.propTypes = {
    senseData: PropTypes.shape({
        order: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        pos: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        definition: PropTypes.string.isRequired,
        additional_info: PropTypes.shape({
            region_info: PropTypes.shape({
                region: PropTypes.string,
            }),
            example_info: PropTypes.arrayOf(PropTypes.shape({})),
            proverb_info: PropTypes.arrayOf(PropTypes.shape({})),
        }),
    }).isRequired,
};

export default KoreanSenseView;
