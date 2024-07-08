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
    ];

    const updateViewAndPushToHistory =
        useContext(ViewContext)["updateViewAndPushToHistory"];

    return (
        <div style={{ display: "table" }}>
            {possibleRelationTypes.map(
                (relationType, index) =>
                    relationInfo.filter(
                        (relation) => relation["type"] === relationType
                    ).length > 0 && (
                        <dl key={index}>
                            <dt
                                style={{
                                    display: "table-cell",
                                    whiteSpace: "nowrap",
                                    width: "100px",
                                }}
                            >
                                {relationType}
                            </dt>
                            <dd style={{ display: "table-cell" }}>
                                {relationInfo
                                    .filter(
                                        (relation) =>
                                            relation["type"] === relationType
                                    )
                                    .map(
                                        (
                                            filteredRelation,
                                            innerIndex,
                                            filteredArray
                                        ) => (
                                            <React.Fragment key={innerIndex}>
                                                <span
                                                    className={
                                                        filteredRelation.link_target_code
                                                            ? "clickable-result"
                                                            : ""
                                                    }
                                                    key={innerIndex}
                                                    onClick={() => {
                                                        if (
                                                            filteredRelation.link_target_code
                                                        )
                                                            updateViewAndPushToHistory(
                                                                {
                                                                    view: "detail_korean",
                                                                    value: filteredRelation.link_target_code,
                                                                    searchBarInitialState:
                                                                        {
                                                                            boxContent:
                                                                                filteredRelation.word,
                                                                            dictionary:
                                                                                "korean",
                                                                        },
                                                                }
                                                            );
                                                    }}
                                                >
                                                    {filteredRelation.word}
                                                </span>
                                                {innerIndex <
                                                    filteredArray.length - 1 &&
                                                    ", "}
                                            </React.Fragment>
                                        )
                                    )}
                            </dd>
                        </dl>
                    )
            )}
        </div>
    );
};

export default SenseRelationInfo;
