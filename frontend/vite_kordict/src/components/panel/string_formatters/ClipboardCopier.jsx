import React, { useState, useEffect } from "react";

import "./universal-styles.css";

const ClipboardCopier = ({ string }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    if (showCheckmark) {
      setTimeout(() => {
        setShowCheckmark(false);
      }, 1000);
    }
  }, [showCheckmark]);

  const handleClick = (e) => {
    e.preventDefault();

    navigator.clipboard
      .writeText(string)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <span className="clipboard-copier-container">
      <span className="clipboard-symbol" onClick={handleClick}>
        🗐
      </span>
    </span>
  );
};

export default ClipboardCopier;
