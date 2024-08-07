import React, { useCallback, useRef } from "react";

export const useSpamProtectedSetter = ({ dataGetter, setter }) => {
    const requestRef = useRef(0);

    const spamProtected = useCallback(async () => {
        requestRef.current++;
        const thisRequestNum = requestRef.current;

        const data = await dataGetter();

        if (requestRef.current === thisRequestNum) {
            setter(data);
        }
    }, [dataGetter, setter]);

    return spamProtected;
};
