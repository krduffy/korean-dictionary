import { useState } from "react";

export const useAPIPoster = ({ initialFormData }) => {
  const [successful, setSuccessful] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const updateFormDataField = (field, value) => {
    let newFormData = { ...formData };
    newFormData[field] = value;
    setFormData(newFormData);
  };

  const apiPost = (url, body) => {
    setSuccessful(false);
    setError(false);

    const token = localStorage.getItem("token");

    const headers = token
      ? {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        }
      : { "Content-Type": "application/json" };

    fetch(url, {
      method: "POST",
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
        });
    });
  };

  return {
    formData,
    updateFormDataField,
    apiPost,
    successful,
    response,
    error,
  };
};
