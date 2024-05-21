import React from "react";

const SenseNormInfo = ({ normInfo }) => {
    return (
        <div className="sense-norm-info">
            <p className="additional-info-section-header">규범 정보</p>
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
        </div>
    );
};

export default SenseNormInfo;
