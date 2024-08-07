import ErrorMessage from "./ErrorMessage";
import { LoadingMessage } from "./LoadingMessage";

import { DELAY_UNTIL_ERROR_MESSAGE_MS } from "../../../constants.js";

/* Child cannot error if !loading and !error. It will still try to initially mount to the dom
   so redundant conditional rendering is likely to be required. */

const LoadErrorOrChild = ({
    children,
    loading,
    error,
    response,
    customLoadingCondition,
    customErrorCondition,
    /* checkErrorFirst for conditions that require being checked before loading */
    checkErrorFirst,
}) => {
    const getErrorMsgAfterDelay = () => {
        setTimeout(() => {
            return <ErrorMessage errorResponse={response} />;
        }, DELAY_UNTIL_ERROR_MESSAGE_MS);
    };

    if (checkErrorFirst && customErrorCondition?.()) {
        return getErrorMsgAfterDelay();
    } else if (customLoadingCondition?.()) {
        return <LoadingMessage />;
    } else if (customErrorCondition?.()) {
        return getErrorMsgAfterDelay();
    }

    if (checkErrorFirst && !customErrorCondition && error) {
        return getErrorMsgAfterDelay();
    } else if (loading && !customLoadingCondition) {
        return <LoadingMessage />;
    } else if (error && !customErrorCondition) {
        return getErrorMsgAfterDelay();
    } else {
        return <>{children}</>;
    }
};

export default LoadErrorOrChild;
