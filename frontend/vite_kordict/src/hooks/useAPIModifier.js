import { useState } from "react";

import { BASE_URL } from "../constants.js";
import { processRequest } from "./cache.js";

/**
 * A hook for making any request to the API other than a get request.
 *
 * @param {boolean} useFormDataObject - Whether to use a `FormData` object to store form data. Defaults to true.
 * @param {Object} initialJSONObject - The initial object to use. Should be a mapping of form data
 * to initial values such as {"username": "un", "password": "pw"}. This dictionary will be turned into
 * a `FormData` object if `useFormDataObject` is true.
 * @returns {{
 *   formData: FormData|Object,
 *   updateFormDataField: Function,
 *   initFormFromDict: Function,
 *   apiModify: Function,
 *   successful: boolean,
 *   response: any,
 *   error: boolean,
 *   loading: boolean
 * }}
 *   An object containing the following properties:
 *   formData - A `FormData` object or a regular object containing the form data
 *   updateFormDataField - A function to update a field in the form data
 *   initFormFromDict - A function to initialize the form data from a dictionary
 *   apiModify - A function to make API requests
 *   successful - A boolean indicating whether the last API request was successful
 *   response - The response data from the last API request
 *   error - A boolean indicating whether an error occurred during the last API request
 *   loading - A boolean indicating whether an API request is currently in progress
 */
export const useAPIModifier = (useFormDataObject = true, initialJSONObject) => {
    const [successful, setSuccessful] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    /* only works for when useFormDataObject is true.
       if it is not, then initial values are passed in via initialJSONObject.
       */
    const initFormFromDict = (dictionary) => {
        const newFormData = new FormData();
        if (!dictionary) {
            return newFormData;
        }
        for (const [key, value] of Object.entries(dictionary)) {
            newFormData.set(key, value);
        }

        return newFormData;
    };

    const [formData, setFormData] = useState(
        useFormDataObject
            ? initFormFromDict(initialJSONObject)
            : initialJSONObject
    );

    /**
     * A function that updates a single field in `formData` with a new value.
     *
     * @param {string} field - The field to update in `formData`.
     * @param {any} value - The value to set for `field`.
     */
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

        setFormData(newFormData);
    };

    /**
     * A function that sends requests to the API. `response` will be updated with the response to the request.
     *
     * @param {string} url - The API endpoint to send the request to.
     * @param {string} token - An optional authentication token to send with the request.
     * @param {Object} body - A dictionary of keys and values to send in the body of the request.
     * @param {string} method - The method of the request (POST, DELETE, ...).
     * @returns {Promise<any>} A Promise that resolves with the response data or rejects with an error.
     */
    const apiModify = async (url, token, body, method) => {
        const fullUrl = BASE_URL + url;

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

        try {
            const response = await fetch(fullUrl, {
                method: method,
                body: body,
                headers: headers,
            });

            const text = await response.text();
            let asJSON;

            try {
                asJSON = JSON.parse(text);
            } catch {
                asJSON = {};
            }

            setResponse(asJSON);

            if (!response.ok) {
                setError(true);
                return asJSON;
            } else {
                const additionalInfo = {
                    word: asJSON["word"] || "",
                    target_code: asJSON["target_code"] || "",
                    word_ref: asJSON["word_ref"] || null,
                    referent: asJSON["referent"] || null,
                    origin: asJSON["origin"] || "",
                };

                processRequest(url, method, additionalInfo);

                setSuccessful(true);
                return asJSON;
            }
        } catch (err) {
            setError(true);
            console.error("Fetch error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
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
