import React from "react";

import ErrorMessage from "../panel/messages/ErrorMessage.jsx";

/**
 * A component that renders a form for entering a username and password.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to be displayed in the form header and on the submit button.
 * @param {Function} props.setNavState - The function that updates the navigation state of user account management.
 * @param {Function} props.handleSubmit - A function to handle form submission.
 * @param {Function} props.updateFormDataField - The function to update a form field value.
 * @param {boolean} props.successful - The flag indicating if the form submission was successful.
 * @param {boolean} props.error - The flag indicating if an error occurred during form submission.
 * @param {Object} props.response - The response object received from the server after form submission.
 * @returns {JSX.Element} The rendered UsernamePasswordForm component.
 */
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
