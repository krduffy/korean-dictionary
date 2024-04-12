import { useState } from "react";

export function useAPIPoster() {
  const [successful, setSuccessful] = useState(false);
  const [error, setError] = useState(null);

  const apiPost = (url, body) => {
    setSuccessful(false);
    setError(null);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error");
        } else {
          setSuccessful(true);
          return response.json();
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  return { apiPost, successful, error };
}
