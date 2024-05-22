import React from "react";

import PropTypes from "prop-types";

const ErrorMessage = ({ errorResponse }) => {
    return (
        <div>
            <span>오류가 발생했습니다. 세부 사항:</span>
            <ul>
                {Object.keys(errorResponse)
                    .flatMap((key) => errorResponse[key])
                    .map((error, id) => (
                        <li key={id}>{error}</li>
                    ))}
            </ul>
        </div>
    );
};

ErrorMessage.propTypes = {
    errorResponse: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
        .isRequired,
};

export default ErrorMessage;
