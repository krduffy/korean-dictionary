import { useState } from "react";

export function useAPIFetcher() {
    const BASE_URL = "http://127.0.0.1:8000/";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiFetch = (url, token, setStateHook) => {
        url = BASE_URL + url;
        setLoading(true);
        setError(null);

        const headers = token
            ? {
                  "Content-Type": "application/json",
                  Authorization: `Token ${token}`,
              }
            : { "Content-Type": "application/json" };

        fetch(url, { headers })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response error");
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setStateHook(data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { apiFetch, loading, error };
}
