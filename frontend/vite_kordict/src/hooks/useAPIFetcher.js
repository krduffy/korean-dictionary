import { useState } from "react";

export function useAPIFetcher() {
    const BASE_URL = "http://127.0.0.1:8000/";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiFetch = async (url, token) => {
        url = BASE_URL + url;
        setLoading(true);
        setError(null);

        const headers = token
            ? {
                  "Content-Type": "application/json",
                  Authorization: `Token ${token}`,
              }
            : { "Content-Type": "application/json" };

        try {
            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error("Network error.");
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            setError(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { apiFetch, loading, error };
}
