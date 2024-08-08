import React, { useEffect, useState } from "react";

import { ERROR_BLOCK_TIME_MS } from "../../../constants.js";

import ErrorMessage from "./ErrorMessage.jsx";
import { LoadingMessage } from "./LoadingMessage.jsx";

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
    const [errorBlock, setErrorBlock] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setErrorBlock(false);
        }, ERROR_BLOCK_TIME_MS);
    }, []);

    const errorOrLoading = () => {
        return errorBlock ? (
            <LoadingMessage />
        ) : (
            <ErrorMessage errorResponse={response} />
        );
    };

    if (checkErrorFirst && customErrorCondition?.()) {
        return errorOrLoading();
    } else if (customLoadingCondition?.()) {
        return <LoadingMessage />;
    } else if (customErrorCondition?.()) {
        return errorOrLoading();
    }

    if (checkErrorFirst && !customErrorCondition && error) {
        return errorOrLoading();
    } else if (loading && !customLoadingCondition) {
        return <LoadingMessage />;
    } else if (error && !customErrorCondition) {
        return errorOrLoading();
    } else {
        return children || null;
    }
};

export default LoadErrorOrChild;
