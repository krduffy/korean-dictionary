import React, { useEffect, useRef, useState } from "react";

import { BACKEND_POLLING_INTERVAL_MS, BASE_URL } from "../constants.js";

export const useBackendPoller = () => {
    const [backendAvailable, setBackendAvailable] = useState(false);
    let startedPolling = useRef(false);

    /* Api fetcher is not used to fetch the urls in this hook to prevent the result from ever
       being cached. */

    const checkIfBackendIsAvailable = async () => {
        const checkAvailabilityUrl = BASE_URL + "settings/check_availability/";

        try {
            const response = await fetch(checkAvailabilityUrl);
            const asJSON = await response.json();
            return asJSON["status"] === "available";
        } catch (err) {
            return false;
        }
    };

    const poll = async () => {
        const isAvailable = await checkIfBackendIsAvailable();
        setBackendAvailable(isAvailable);

        setTimeout(() => poll(), BACKEND_POLLING_INTERVAL_MS);
    };

    useEffect(() => {
        if (!startedPolling.current) {
            startedPolling.current = true;
            poll();
        }
    }, []);

    return { backendAvailable };
};
