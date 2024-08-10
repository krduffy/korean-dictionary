import React from "react";

import StringWithNLP from "../../string_formatters/StringWithNLP.jsx";

const SenseNormInfo = ({ normInfo }) => {
    return (
        <ul>
            {normInfo.map((norm, id, array) => (
                <li
                    key={id}
                    style={{
                        paddingBottom: id != array.length - 1 ? "20px" : "",
                    }}
                >
                    <div style={{ paddingBottom: "5px" }}>
                        <span className="word-emphasized-box">{norm.type}</span>
                        {norm.role && (
                            <span>
                                {" "}
                                <StringWithNLP string={norm.role} />
                            </span>
                        )}
                    </div>
                    {norm.desc && (
                        <div>
                            → <StringWithNLP string={norm.desc} />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default SenseNormInfo;
