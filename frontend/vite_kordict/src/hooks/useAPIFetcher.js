import { useState } from "react";

import { BASE_URL } from "../constants.js";
import { cachePut, cacheRetrieve } from "./cache.js";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [response, setResponse] = useState(null);

    /**
     * Returns the headers for a get request. Content-Type is set to "application/json"
     * and Authorization will be set to "Token `token`" if a token is provided.
     *
     * @param {string | null} token - The user's authentication token (or null).
     * @returns {object} An object containing the request headers.
     */
    const getHeaders = (token) => {
        return token
            ? {
                  "Content-Type": "application/json",
                  Authorization: `Token ${token}`,
              }
            : { "Content-Type": "application/json" };
    };

    /**
     * Asynchronous function to fetch data from the API.
     *
     * @param {string} url - The URL endpoint to fetch data from
     * @param {string} [token] - An optional authentication token
     * @returns {Promise<any>} A Promise that resolves with the fetched data or rejects with an error
     */
    const apiFetch = async (url, token) => {
        setLoading(true);
        setError(false);

        const cachedResponse = cacheRetrieve(url);
        if (cachedResponse) {
            /* Responses that result in error are not cached, so not a consideration */

            /* Looks better to have loading appear briefly */
            const delay = 250;
            await new Promise((resolve) => setTimeout(resolve, delay));

            return new Promise((resolve) => {
                resolve(cachedResponse);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            const fullUrl = BASE_URL + url;

            const headers = getHeaders(token);

            try {
                const response = await fetch(fullUrl, { headers });
                const data = await response.json();
                setResponse(data);

                if (!response.ok) {
                    throw new Error("Network error.");
                } else {
                    cachePut(url, data);
                    return data;
                }
            } catch (error) {
                setError(true);
                return null;
            } finally {
                setLoading(false);
            }
        }
    };

    /**
     * A function to prefetch a url and store its response in the cache.
     * If the request returns an error status code, the response is not cached.
     *
     * @param {string} url - The url to prefetch.
     * @param {string} token - An authorization token.
     */
    const apiPrefetch = async (url, token) => {
        const alreadyCached = cacheRetrieve(url) != null;

        if (!alreadyCached) {
            const fullUrl = BASE_URL + url;

            const headers = getHeaders(token);

            const response = await fetch(fullUrl, { headers });

            if (response.ok) {
                const data = await response.json();
                cachePut(url, data);
            }
        }
    };

    return { apiFetch, apiPrefetch, loading, error, response };
}
