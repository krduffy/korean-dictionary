import React from "react";

const SenseGrammarInfo = ({ grammarInfo }) => {
    return (
        <ul>
            {grammarInfo.map((grammar, id) => (
                <li key={id} style={{ paddingLeft: "5px" }}>
                    <span>{grammar.grammar}</span>
                </li>
            ))}
        </ul>
    );
};

export default SenseGrammarInfo;
