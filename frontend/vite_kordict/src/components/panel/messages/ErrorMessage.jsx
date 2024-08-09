import React from "react";

import PropTypes from "prop-types";

const ErrorMessage = ({ errorResponse }) => {
    const getErrors = () => {
        try {
            let toReturn;
            for (let i = 0; i < Object.keys(errorResponse).length; i++) {
                if (Object.keys(errorResponse)[i].endsWith("errors")) {
                    toReturn = errorResponse[Object.keys(errorResponse)[i]];
                }
            }

            if (!toReturn || !Array.isArray(toReturn)) {
                throw new Error(
                    "Error response found nothing or found non-array"
                );
            }

            return toReturn;
        } catch (error) {
            return ["자세한 내용은 없습니다."];
        }
    };

    const errors = getErrors();

    return (
        <div className="error-message">
            <span className="error-message-header">
                오류가 발생했습니다. 세부 사항:
            </span>
            <ul>
                {errors?.map((errorString, id) => (
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
