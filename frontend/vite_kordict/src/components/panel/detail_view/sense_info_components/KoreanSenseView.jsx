import React from "react";

import PropTypes from "prop-types";

import StringWithNLP from "../../string_formatters/StringWithNLP.jsx";
import TruncatorDropdown from "../../string_formatters/TruncatorDropdown.jsx";
import SenseExampleInfo from "./SenseExampleInfo.jsx";
import SenseGrammarInfo from "./SenseGrammarInfo.jsx";
import SenseNormInfo from "./SenseNormInfo.jsx";
import SenseProverbInfo from "./SenseProverbInfo.jsx";
import SenseRelationInfo from "./SenseRelationInfo.jsx";

/**
 * A component for viewing all of the data for a single sense for a Korean word.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.senseData - The map of sense data.
 * @returns {React.JSX.Element} The rendered KoreanSenseView component.
 */
const KoreanSenseView = ({ senseData }) => {
    return (
        <div>
            <div className="pad-10">
                {senseData["order"] !== 0 && (
                    <div style={{ marginBottom: "10px" }}>
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
                                (pattern, id) => (
                                    <span key={id} style={{ color: "#42d1f5" }}>
                                        ≪{pattern.pattern}≫{" "}
                                    </span>
                                )
                            )}
                        <StringWithNLP string={senseData["definition"]} />
                        {senseData["additional_info"]["region_info"] && (
                            <span>
                                <span> (</span>
                                {senseData["additional_info"][
                                    "region_info"
                                ].map((region, id, regionArray) => (
                                    <span key={id}>
                                        {region["region"]}
                                        {id + 1 < regionArray.length && ", "}
                                    </span>
                                ))}
                                <span>)</span>
                            </span>
                        )}
                    </div>
                )}

                {/* is a drop down menu because there can be a lot of data*/}
                {Object.keys(senseData["additional_info"]).length > 0 && (
                    <div className="additional-info-container">
                        <TruncatorDropdown>
                            {senseData["additional_info"]["example_info"] && (
                                <div className="pad-10">
                                    <SenseExampleInfo
                                        exampleInfo={
                                            senseData["additional_info"][
                                                "example_info"
                                            ]
                                        }
                                    />
                                </div>
                            )}
                            {senseData["additional_info"]["grammar_info"] && (
                                <div className="curved-box-nest2 tbmargin-10">
                                    <div className="curved-box-header-nest2">
                                        문법 정보
                                    </div>
                                    <div className="pad-10">
                                        <SenseGrammarInfo
                                            grammarInfo={
                                                senseData["additional_info"][
                                                    "grammar_info"
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {senseData["additional_info"]["norm_info"] && (
                                <div className="curved-box-nest2 tbmargin-10">
                                    <div className="curved-box-header-nest2">
                                        규범 정보
                                    </div>
                                    <div className="pad-10">
                                        <SenseNormInfo
                                            normInfo={
                                                senseData["additional_info"][
                                                    "norm_info"
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {senseData["additional_info"]["relation_info"] && (
                                <div className="curved-box-nest2 tbmargin-10">
                                    <div className="curved-box-header-nest2">
                                        관련 어휘
                                    </div>
                                    <div className="pad-10">
                                        <SenseRelationInfo
                                            relationInfo={
                                                senseData["additional_info"][
                                                    "relation_info"
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {senseData["additional_info"]["proverb_info"] && (
                                <div className="curved-box-nest2 tbmargin-10">
                                    <div className="curved-box-header-nest2">
                                        관용구·속담
                                    </div>
                                    <div className="pad-10">
                                        <SenseProverbInfo
                                            proverbInfo={
                                                senseData["additional_info"][
                                                    "proverb_info"
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                            {/*
                            {senseData["additional_info"]["history_info"] && (
                              <SenseHistoryInfo
                                historyInfo={senseData["additional_info"]["history_info"]}
                              />
                            )} */}
                        </TruncatorDropdown>
                    </div>
                )}
            </div>
        </div>
    );
};

/* Representation of sense can be found in korean-dictionary/api/management/dict_files/json_structure.txt */
KoreanSenseView.propTypes = {
    senseData: PropTypes.shape({
        order: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        pos: PropTypes.string,
        category: PropTypes.string,
        definition: PropTypes.string.isRequired,
        additional_info: PropTypes.shape({
            region_info: PropTypes.arrayOf(
                PropTypes.shape({
                    region: PropTypes.string.isRequired,
                })
            ),
            example_info: PropTypes.arrayOf(PropTypes.shape({})),
            grammar_info: PropTypes.arrayOf(PropTypes.shape({})),
            norm_info: PropTypes.arrayOf(PropTypes.shape({})),
            relation_info: PropTypes.arrayOf(PropTypes.shape({})),
            proverb_info: PropTypes.arrayOf(PropTypes.shape({})),
            pattern_info: PropTypes.arrayOf(
                PropTypes.shape({
                    pattern: PropTypes.string.isRequired,
                })
            ),
        }).isRequired,
    }).isRequired,
};

export default KoreanSenseView;
