import React, { useContext, useEffect, useState } from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

import "./form-styles.css";

const AddExampleForm = ({
    wordTargetCode,
    senseTargetCode,
    initiallyExistingExamples,
}) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    // Use a function to initialize state for better handling of initial values
    const [exampleList, setExampleList] = useState(initiallyExistingExamples);

    useEffect(() => {
        setExampleList(initiallyExistingExamples);
    }, [initiallyExistingExamples]);

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    } = useAPIModifier(false, {
        referent: wordTargetCode,
        definition: "정의", // will not be rendered in sense view component because order is 0
        additional_info: {
            example_info: exampleList,
        },
        order: 0,
    });

    const updateExampleInfo = (index, field, value) => {
        const newExampleList = [...exampleList];
        newExampleList[index] = {
            ...newExampleList[index],
            [field]: value,
        };
        setExampleList(newExampleList);
        //updateFormDataField("additional_info", {
        //    example_info: newExampleList,
        //});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url =
            exampleList.length > 0
                ? "api/create_sense/"
                : `api/delete_sense/${senseTargetCode}`;
        const method = exampleList.length > 0 ? "POST" : "DELETE";

        apiModify(url, authInfo["token"], formData, method);
    };

    useEffect(() => {
        updateFormDataField("additional_info", {
            example_info: exampleList,
        });
    }, [exampleList]);

    const addNewExample = () => {
        setExampleList([
            ...exampleList,
            {
                example: "",
                source: "",
            },
        ]);
    };

    const deleteExampleByIndex = (index) => {
        setExampleList([
            ...exampleList.slice(0, index),
            ...exampleList.slice(index + 1),
        ]);
    };

    return (
        <div className="curved-box">
            <div className="curved-box-header">예문 수정</div>

            <div className="pad-10">
                <div className="form-tip">
                    추가하시는 단어는 본인만 보실 수 있습니다.
                </div>
                <div className="form-tip">
                    예문 입력 시 중활고에 담는 단어 아래에 밑줄을 그려줍니다.
                </div>
                <div className="form-tip-detail">
                    내가 그린 &#123;기린&#125; 그림은... -&gt; 내가 그린{" "}
                    <span className="underlined">기린</span> 그림은...
                </div>

                <br />
                <div className="horizontal-bar" />
                <br />

                {exampleList.length == 0 ? (
                    <div className="no-examples-text">예문이 없습니다.</div>
                ) : (
                    exampleList.map((example, index) => (
                        <div
                            className="curved-box-nest1 tbmargin-10"
                            key={index}
                        >
                            <div className="curved-box-header space-children-horizontal">
                                <div>예문 {index + 1}</div>
                                <div
                                    /* color is overriden; curved box just for shape. */
                                    className="curved-box-shape item-delete-button textcentered lrpad-10 pointer"
                                    onClick={() => deleteExampleByIndex(index)}
                                >
                                    예문 삭제
                                </div>
                            </div>

                            <div className="pad-10">
                                <dl>
                                    <dt className="text-area-container-dt">
                                        예문 (필수)
                                    </dt>
                                    <dd className="text-area-container-dd">
                                        <textarea
                                            className="add-example-text-area"
                                            value={example.example}
                                            onChange={(event) =>
                                                updateExampleInfo(
                                                    index,
                                                    "example",
                                                    event.target.value
                                                )
                                            }
                                        ></textarea>
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className="text-area-container-dt">
                                        출처 (선택)
                                    </dt>
                                    <dd className="text-area-container-dd">
                                        <textarea
                                            className="add-example-text-area"
                                            value={example.source}
                                            onChange={(event) =>
                                                updateExampleInfo(
                                                    index,
                                                    "source",
                                                    event.target.value
                                                )
                                            }
                                        ></textarea>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    ))
                )}

                <div className="add-example-form-lower-bar">
                    <button
                        onClick={addNewExample}
                        className="add-new-example-button"
                    >
                        예문 추가
                    </button>
                    <br />
                    <button
                        onClick={(e) => handleSubmit(e)}
                        className="add-example-submit-button"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddExampleForm;
