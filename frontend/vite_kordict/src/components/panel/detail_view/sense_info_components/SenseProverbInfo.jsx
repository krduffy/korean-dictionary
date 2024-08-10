import React from "react";

import PropTypes from "prop-types";

import { getBasicDetailKoreanView } from "../../../../../util/viewUtils.js";

import PanelSpecificClickableText from "../../string_formatters/PanelSpecificClickableText.jsx";
import StringWithNLP from "../../string_formatters/StringWithNLP.jsx";

const SenseProverbInfo = ({ proverbInfo }) => {
    return (
        <ul>
            {proverbInfo.map((proverb, id) => (
                <li style={{ marginTop: "5px", marginBottom: "15px" }} key={id}>
                    <SenseProverb proverb={proverb} />
                </li>
            ))}
        </ul>
    );
};

SenseProverbInfo.propTypes = {
    proverbInfo: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            word: PropTypes.string.isRequired,
            definition: PropTypes.string.isRequired,
            link_target_code: PropTypes.number, // optional
        })
    ).isRequired,
};

const SenseProverb = ({ proverb }) => {
    return (
        <>
            <div style={{ paddingBottom: "5px" }}>
                <span style={{ color: "#8e44ad" }}>{proverb.type}</span>{" "}
                <PanelSpecificClickableText
                    text={proverb.word}
                    viewOnPush={getBasicDetailKoreanView(
                        proverb.word,
                        proverb.link_target_code
                    )}
                />
            </div>
            <div style={{ position: "relative", left: "10px" }}>
                <StringWithNLP string={proverb.definition} />
            </div>
        </>
    );
};

SenseProverb.propTypes = {
    proverb: PropTypes.shape({
        type: PropTypes.string.isRequired,
        word: PropTypes.string.isRequired,
        definition: PropTypes.string.isRequired,
        link_target_code: PropTypes.number,
    }).isRequired,
};

export default SenseProverbInfo;
