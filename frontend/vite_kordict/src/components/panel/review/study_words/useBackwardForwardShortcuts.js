import React, { useCallback, useEffect, useRef } from "react";

export const useBackwardForwardShortcuts = (
    enable,
    backKey,
    forwardKey,
    currentNumber,
    setCurrentNumber,
    numWords
) => {
    // Use a ref to store the current number to avoid stale closures
    const currentNumberRef = useRef(currentNumber);
    currentNumberRef.current = currentNumber;

    const checkKeyDown = useCallback(
        (event) => {
            if (
                event.key === forwardKey &&
                currentNumberRef.current < numWords
            ) {
                setCurrentNumber(currentNumberRef.current + 1);
            } else if (event.key === backKey && currentNumberRef.current > 1) {
                setCurrentNumber(currentNumberRef.current - 1);
            }
        },
        [backKey, forwardKey, setCurrentNumber, numWords]
    );

    useEffect(() => {
        if (enable) {
            window.addEventListener("keydown", checkKeyDown);
            return () => {
                window.removeEventListener("keydown", checkKeyDown);
            };
        }
    }, [enable, checkKeyDown]);
};
