import React from "react";

import ErrorMessage from "../panel/messages/ErrorMessage.jsx";

const UsernamePasswordForm = ({
    title,
    setNavState,
    handleSubmit,
    updateFormDataField,
    successful,
    error,
    response,
}) => {
    return (
        <div className="login-box">
            <div id="login-form-top-strip">
                <span id="login-form-header">{title}</span>
                <button
                    id="cancel-login-button"
                    onClick={() => {
                        setNavState("none");
                    }}
                >
                    ✖
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="username" className="login-label">
                        아이디
                    </label>
                    <input
                        className="login-input"
                        type="text"
                        name="username"
                        onChange={(e) => {
                            updateFormDataField("username", e.target.value);
                        }}
                    ></input>
                </div>
                <div className="input-container">
                    <label htmlFor="password" className="login-label">
                        비밀번호
                    </label>
                    <input
                        className="login-input"
                        type="password"
                        name="password"
                        onChange={(e) => {
                            updateFormDataField("password", e.target.value);
                        }}
                    ></input>
                </div>

                <div id="submit-and-message-container">
                    <div id="messages-container">
                        {successful && (
                            <span id="login-success-message">{title} 성공</span>
                        )}
                        {error && response && (
                            <span id="login-fail-message">
                                <ErrorMessage errorResponse={response} />
                            </span>
                        )}
                    </div>
                    <button id="submit-login-button" onClick={handleSubmit}>
                        {title}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsernamePasswordForm;
