import React, { useRef } from "react";

import { GET_REQUEST_DEBOUNCE_TIME_MS } from "../constants.js";

export const useDebounce = (func) => {
    const recentArgs = useRef([]);

    const debounced = (...args) => {
        const argsAsString = JSON.stringify(args);

        if (!recentArgs.current.includes(argsAsString)) {
            recentArgs.current.push(argsAsString);
            setTimeout(() => {
                const indexToDelete = recentArgs.current.indexOf(argsAsString);
                if (indexToDelete >= 0) {
                    recentArgs.current.splice(indexToDelete, 1);
                }
            }, GET_REQUEST_DEBOUNCE_TIME_MS);

            func(...args);
        }
    };

    return debounced;
};
