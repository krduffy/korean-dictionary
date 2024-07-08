import React from "react";

const SenseNormInfo = ({ normInfo }) => {
    return (
        <ul>
            {normInfo.map((norm, id) => (
                <li key={id}>
                    <span>
                        {norm.type} {norm.role}
                    </span>
                    <span>{norm.desc}</span>
                </li>
            ))}
        </ul>
    );
};

export default SenseNormInfo;
