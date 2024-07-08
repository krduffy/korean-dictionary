import React, { useContext } from "react";

import PropTypes from "prop-types";

import { ViewContext } from "../../Panel.jsx";

const SenseProverbInfo = ({ proverbInfo }) => {
    return (
        <div className="sense-proverb-list">
            <p className="section-header">관용구·속담</p>
            <ul>
                {proverbInfo.map((proverb, id) => (
                    <li key={id}>
                        <SenseProverb proverb={proverb} />
                    </li>
                ))}
            </ul>
        </div>
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
    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];
    return (
        <div className="sense-proverb">
            <span style={{ color: "#8e44ad" }}>{proverb.type}</span>{" "}
            <span
                className="clickable-result"
                onClick={() => {
                    if (proverb.link_target_code) {
                        updateViewAndPushToHistory({
                            view: "detail_korean",
                            value: proverb.link_target_code,
                            searchBarInitialState: {
                                boxContent: proverb.word,
                                dictionary: "korean",
                            },
                        });
                    }
                }}
            >
                {proverb.word}
            </span>
            <div className="proverb-definition">{proverb.definition}</div>
        </div>
    );
};

SenseProverb.propTypes = {
    proverb: PropTypes.shape({
        type: PropTypes.string.isRequired,
        word: PropTypes.string.isRequired,
        definition: PropTypes.string.isRequired,
        link_target_code: PropTypes.number, // optional
    }).isRequired,
};

export default SenseProverbInfo;
