import React from "react";

const SenseGrammarInfo = ({ grammarInfo }) => {
    return (
        <div className="sense-grammar-info">
            <p className="additional-info-section-header">문법 정보</p>
            <ul>
                {grammarInfo.map((grammar, id) => (
                    <li key={id}>
                        <span>{grammar.grammar}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SenseGrammarInfo;
