import React from "react";

import PropTypes from "prop-types";

import StringWithNLP from "../../string_formatters/StringWithNLP.jsx";

const SenseExampleInfo = ({ exampleInfo }) => {
    return (
        <ul>
            {exampleInfo.map((ex, id) => (
                <li key={id}>
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
        <div style={{ marginBottom: "10px" }}>
            <StringWithNLP string={example["example"]} hasExamples={true} />

            {example["source"] && (
                <div className="source">출처: {example["source"]}</div>
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
