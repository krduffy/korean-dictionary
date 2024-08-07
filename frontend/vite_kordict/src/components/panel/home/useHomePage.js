import React, { useContext, useEffect, useState } from "react";

import { HANJA_GAME_LENGTH } from "../../../constants.js";
import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import { ViewContext } from "../Panel.jsx";

export const useHomePage = (initialSeed, initialHanjaGameSeed) => {
    const [homepageData, setHomepageData] = useState();
    const { apiFetch, apiPrefetch, loading, error, response } = useAPIFetcher();
    const [seed, setSeed] = useState(initialSeed);

    const authContext = useContext(AuthenticationInfoContext);
    const authInfo = authContext["authInfo"];

    const viewContext = useContext(ViewContext);
    const updateViewAndPushToHistory =
        viewContext["updateViewAndPushToHistory"];

    useEffect(() => {
        if (authInfo["token"]) {
            const setData = async () => {
                const data = await apiFetch(
                    `api/homepage_info/?seed=${seed}`,
                    authInfo["token"]
                );

                setHomepageData(data);
            };
            setData();

            const hanjaUrl = `api/hanja_game_info/?length=${HANJA_GAME_LENGTH}&seed=${initialHanjaGameSeed}`;
            apiPrefetch(hanjaUrl, authInfo["token"]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seed, authInfo["token"]]);

    return {
        homepageData,
        setHomepageData,
        loading,
        error,
        response,
        seed,
        setSeed,
        updateViewAndPushToHistory,
    };
};
