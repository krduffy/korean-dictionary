import React, { useRef } from "react";

import "./form-component-styles.css";

const FileUpload = ({ updateFormDataField, fieldToUpdate }) => {
    const selectedFileTextRef = useRef(null);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            selectedFileTextRef.current.innerText = event.target.files[0].name;
            updateFormDataField(fieldToUpdate, event.target.files[0]);
        }
    };

    return (
        <>
            <label className="upload-file-button">
                <input
                    type="file"
                    className="file-input"
                    accept=".jpg,.png,.gif"
                    onChange={(event) => {
                        handleFileChange(event);
                    }}
                ></input>
                <span>파일 찾아보기</span>
            </label>
            <span ref={selectedFileTextRef} className="selected-file-span">
                선택한 파일이 없습니다.
            </span>
        </>
    );
};

export default FileUpload;
