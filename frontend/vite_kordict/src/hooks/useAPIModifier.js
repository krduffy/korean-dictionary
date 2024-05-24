import { useState } from "react";

export const useAPIModifier = (initialFormData) => {
    const [successful, setSuccessful] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(initialFormData);
    const updateFormDataField = (field, value) => {
        let newFormData = { ...formData };
        newFormData[field] = value;
        setFormData(newFormData);
    };

    const apiModify = (url, token, body, method) => {
        setSuccessful(false);
        setError(false);

        setLoading(true);

        const headers = token
            ? {
                  "Content-Type": "application/json",
                  Authorization: `Token ${token}`,
              }
            : { "Content-Type": "application/json" };

        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
        }).then((response) => {
            response
                .text()
                .then((res) => {
                    const asJSON = JSON.parse(res);
                    setResponse(asJSON);
                })
                /* error / success needs to be set after response to ensure that when
           the auth token is added to local storage response is not null */
                .then(() => {
                    if (!response.ok) {
                        setError(true);
                    } else {
                        setSuccessful(true);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        });
    };

    return {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
        loading,
    };
};
