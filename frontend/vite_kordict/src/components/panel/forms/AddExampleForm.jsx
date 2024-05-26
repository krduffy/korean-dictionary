import React, { useContext, useEffect, useState } from "react";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

const AddExampleForm = ({ wordTargetCode, initiallyExistingExamples }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    // Log the initiallyExistingExamples to verify the prop being passed
    console.log("initiallyExistingExamples:", initiallyExistingExamples);

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
    } = useAPIModifier({
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
        updateFormDataField("additional_info", {
            example_info: newExampleList,
        });
    };

    useEffect(() => {
        console.log("example list is now");
        console.log(exampleList);
    }, [exampleList]);

    const handleSubmit = (e) => {
        e.preventDefault();

        apiModify(
            "http://127.0.0.1:8000/api/create_sense/",
            authInfo["token"],
            formData,
            "POST"
        );
    };

    const addNewExample = () => {
        setExampleList([
            ...exampleList,
            {
                example: "",
                source: "",
            },
        ]);
    };

    return (
        <div className="add-example-form">
            <div className="add-example-form-upper-bar">
                <div className="add-example-header">예문 추가</div>
            </div>

            {exampleList.map((example, index) => (
                <div className="text-area-container" key={index}>
                    <dl>
                        <dt className="text-area-container-dt">예문 (필수)</dt>
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
                        <dt className="text-area-container-dt">출처 (선택)</dt>
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
            ))}

            <div className="add-example-form-lower-bar">
                <div className="add-example-tip">
                    예문 입력 시 중활고에 담는 단어 아래에 밑줄을 그려줍니다.
                </div>
                <button
                    onClick={(e) => handleSubmit(e)}
                    className="add-example-submit-button"
                >
                    추가
                </button>
                <button
                    onClick={addNewExample}
                    className="add-new-example-button"
                >
                    예문 추가
                </button>
            </div>
        </div>
    );
};

export default AddExampleForm;
