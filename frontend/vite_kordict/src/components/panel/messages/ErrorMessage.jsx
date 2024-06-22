import React from "react";

import PropTypes from "prop-types";

const ErrorMessage = ({ errorResponse }) => {
    const getErrors = () => {
        for (let i = 0; i < Object.keys(errorResponse).length; i++) {
            if (Object.keys(errorResponse)[i].endsWith("errors")) {
                return errorResponse[Object.keys(errorResponse)[i]];
            }
        }

        return [];
    };

    const errors = getErrors();

    return (
        <div className="error-message">
            <span className="error-message-header">
                오류가 발생했습니다. 세부 사항:
            </span>
            <ul>
                {errors &&
                    errors.map((errorString, id) => (
                        <span key={id}>{errorString}</span>
                    ))}
            </ul>
        </div>
    );
};

ErrorMessage.propTypes = {
    errorResponse: PropTypes.object.isRequired,
};

export default ErrorMessage;
