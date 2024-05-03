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

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) {
        setError(true);
      } else {
        setSuccessful(true);
      }
      response.text().then((res) => {
        const asJSON = JSON.parse(res);
        setResponse(asJSON);
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
