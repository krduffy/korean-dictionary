import { useState } from "react";

import { cachePut, cacheRetrieve } from "./useCache.js";

/**
 * A hook for sending GET requests to the API.
 *
 * @returns {{
 *   apiFetch: Function,
 *   loading: boolean,
 *   error: Error|null
 * }} An object containing the following properties:
 *   apiFetch - An asynchronous function to fetch data from the API
 *   loading - A boolean indicating whether a request is currently in progress
 *   error - An Error object or null, representing any error that occurred during the last request
 */
export function useAPIFetcher() {
    const BASE_URL = "http://127.0.0.1:8000/";
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Asynchronous function to fetch data from the API.
     *
     * @param {string} url - The URL endpoint to fetch data from
     * @param {string} [token] - An optional authentication token
     * @returns {Promise<any>} A Promise that resolves with the fetched data or rejects with an error
     */
    const apiFetch = async (url, token) => {
        setLoading(true);
        setError(null);

        const cachedResponse = cacheRetrieve(url);
        if (cachedResponse) {
            /* Responses that result in error are not cached, so not a consideration */

            return new Promise((resolve) => {
                resolve(cachedResponse);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            const fullUrl = BASE_URL + url;

            const headers = token
                ? {
                      "Content-Type": "application/json",
                      Authorization: `Token ${token}`,
                  }
                : { "Content-Type": "application/json" };
            try {
                const response = await fetch(fullUrl, { headers });

                if (!response.ok) {
                    throw new Error("Network error.");
                } else {
                    const data = await response.json();
                    cachePut(url, data);
                    return data;
                }
            } catch (error) {
                setError(error);
                return null;
            } finally {
                setLoading(false);
            }
        }
    };

    return { apiFetch, loading, error };
}
