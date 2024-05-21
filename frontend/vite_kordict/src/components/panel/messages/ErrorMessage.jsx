import React from "react";

import PropTypes from "prop-types";

const ErrorMessage = ({ errorStrings }) => {
    return (
        <div>
            <span>오류가 발생했습니다. 세부 사항:</span>
            <ul>
                {errorStrings.map((error, id) => (
                    <li key={id}>{error}</li>
                ))}
            </ul>
        </div>
    );
};

ErrorMessage.propTypes = {
    errorStrings: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ErrorMessage;
