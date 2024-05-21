import React from "react";

import PropTypes from "prop-types";

import StringWithNLP from "../../string_formatters/StringWithNLP.jsx";

import "./styles/korean-sense-styles.css";

const SenseExampleInfo = ({ exampleInfo }) => {
    return (
        <ul className="sense-example-list">
            {exampleInfo.map((ex, id) => (
                <li key={id} className="sense-example-list-item">
                    <SenseExample example={ex} />
                </li>
            ))}
        </ul>
    );
};

SenseExampleInfo.propTypes = {
    exampleInfo: PropTypes.arrayOf(
        PropTypes.shape({
            example: PropTypes.string.isRequired,
            source: PropTypes.string,
        })
    ).isRequired,
};

const SenseExample = ({ example }) => {
    return (
        <div className="example-container">
            <StringWithNLP string={example["example"]} hasExamples={true} />

            {example["source"] && (
                <div className="example-source">출처: {example["source"]}</div>
            )}
        </div>
    );
};

SenseExample.propTypes = {
    example: PropTypes.shape({
        example: PropTypes.string.isRequired,
        source: PropTypes.string, // Source is optional
    }).isRequired,
};

export default SenseExampleInfo;
