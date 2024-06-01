import { useEffect, useState } from "react";

export const useAPIModifier = (useFormDataObject = true, initialJSONObject) => {
    const BASE_URL = "http://127.0.0.1:8000/";

    const [successful, setSuccessful] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState(
        useFormDataObject ? new FormData() : initialJSONObject
    );

    const updateFormDataField = (field, value) => {
        let newFormData = useFormDataObject ? new FormData() : {};

        if (useFormDataObject) {
            for (const key of formData.keys()) {
                newFormData.set(key, formData.get(key));
            }
        } else {
            newFormData = { ...formData };
        }

        if (useFormDataObject) {
            newFormData.set(field, value);
        } else {
            newFormData[field] = value;
        }

        console.log(newFormData);
        setFormData(newFormData);
    };

    const apiModify = (url, token, body, method) => {
        url = BASE_URL + url;

        setSuccessful(false);
        setError(false);

        setLoading(true);

        let headers = new Headers();

        if (token) {
            headers.append("Authorization", `Token ${token}`);
        }

        if (!useFormDataObject) {
            body = JSON.stringify(body);
            headers.append("Content-Type", "application/json");
        }

        fetch(url, {
            method: method,
            body: body,
            headers: headers,
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
