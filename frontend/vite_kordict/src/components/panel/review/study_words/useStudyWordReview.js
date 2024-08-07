import React, { useContext, useEffect, useRef, useState } from "react";

import { useAPIFetcher } from "../../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../../App.jsx";

export const useStudyWordReview = ({ initialSettings }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const { apiFetch, apiPrefetch, loading, successful, error, response } =
        useAPIFetcher();

    const [settings, setSettings] = useState(initialSettings);
    const changeSetting = (settingKey, newValue) => {
        const newSettings = {
            ...settings,
            settingKey: newValue,
        };

        setSettings(newSettings);
    };
    const [currentNumber, setCurrentNumber] = useState(1);
    const [numWords, setNumWords] = useState(0);
    const [currentTargetCode, setCurrentTargetCode] = useState(0);

    const allTargetCodesRef = useRef([]);
    useEffect(() => {
        const fillTargetCodes = async () => {
            const response = await apiFetch(
                "api/user_study_words_target_codes/",
                authInfo["token"]
            );

            if (response?.target_codes) {
                allTargetCodesRef.current = response.target_codes;
            }
        };

        fillTargetCodes();
    }, []);

    useEffect(() => {
        setCurrentTargetCode(allTargetCodesRef.current[currentNumber - 1]);
        for (
            let i = Math.max(currentNumber - 3, 0);
            i <
            Math.min(currentNumber + 3, allTargetCodesRef.current.length - 1);
            i++
        ) {
            apiPrefetch(
                `api/korean_word/${allTargetCodesRef.current[i]}`,
                authInfo["token"]
            );
        }
    }, [allTargetCodesRef.current, currentNumber]);

    useEffect(() => {
        setNumWords(allTargetCodesRef.current.length);
    }, [allTargetCodesRef.current]);

    return {
        loading,
        successful,
        error,
        response,
        currentNumber,
        numWords,
        setCurrentNumber,
        currentTargetCode,
        settings,
        changeSetting,
    };
};
