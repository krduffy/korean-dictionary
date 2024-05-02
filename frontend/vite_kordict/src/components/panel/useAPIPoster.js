import { useState } from "react";

export const useAPIPoster = ({ initialFormData }) => {
  const [successful, setSuccessful] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const updateFormDataField = (field, value) => {
    let newFormData = { ...formData };
    newFormData[field] = value;
    setFormData(newFormData);
  };

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
          setResponse(response.json());
        }
      })
      .catch((error) => {
        setError(error);
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
