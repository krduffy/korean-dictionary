import React, { useContext } from "react";

import { ViewContext } from "../../Panel.jsx";

const SenseRelationInfo = ({ relationInfo }) => {
    const possibleRelationTypes = [
        "하위어",
        "상위어",
        "반대말",
        "비슷한말",
        "방언",
        "높임말",
        "옛말",
        "참고 어휘",
        "본말"
    ];

    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];

    const handleClick = (targetCode, word) => {
        updateViewAndPushToHistory({
            view: "detail_korean",
            value: targetCode,
            searchBarInitialState: {
                boxContent: word,
                dictionary: "korean",
            },
        });
    };

    const getRowForType = (type) => {
        return (
            <dl>
                <dt
                    style={{
                        display: "table-cell",
                        whiteSpace: "nowrap",
                        width: "100px",
                    }}
                >
                    {type}
                </dt>
                <dd style={{ display: "table-cell" }}>
                    {relationInfo
                        .filter((relation) => relation["type"] === type)
                        .map((filteredRelation, innerIndex, filteredArray) => (
                            <React.Fragment key={innerIndex}>
                                <span
                                    className={
                                        filteredRelation.link_target_code
                                            ? "clickable-result"
                                            : ""
                                    }
                                    key={innerIndex}
                                    onClick={() => {
                                        if (filteredRelation.link_target_code)
                                            handleClick(
                                                filteredRelation.link_target_code,

                                                filteredRelation.word
                                            );
                                    }}
                                >
                                    {filteredRelation.word}
                                </span>
                                {innerIndex < filteredArray.length - 1 && ", "}
                            </React.Fragment>
                        ))}
                </dd>
            </dl>
        );
    };

    return (
        <div
            style={{
                display: "table",
                borderCollapse: "separate",
                borderSpacing: "0px 5px",
            }}
        >
            {possibleRelationTypes.map(
                (relationType, index) =>
                    relationInfo.filter(
                        (relation) => relation["type"] === relationType
                    ).length > 0 && (
                        <React.Fragment key={index}>
                            {getRowForType(relationType)}
                        </React.Fragment>
                    )
            )}
        </div>
    );
};

export default SenseRelationInfo;
