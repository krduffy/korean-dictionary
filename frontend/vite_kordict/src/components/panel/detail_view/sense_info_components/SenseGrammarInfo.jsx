import React from "react";

const SenseGrammarInfo = ({ grammarInfo }) => {
    return (
        <ul>
            {grammarInfo.map((grammar, id) => (
                <li key={id}>
                    <span>{grammar.grammar}</span>
                </li>
            ))}
        </ul>
    );
};

export default SenseGrammarInfo;
