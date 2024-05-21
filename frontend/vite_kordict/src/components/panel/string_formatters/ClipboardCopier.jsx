import React, { useEffect, useState } from "react";

import "./universal-styles.css";

const ClipboardCopier = ({ string }) => {
    const [showCheckmark, setShowCheckmark] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (showCheckmark) {
            setTimeout(() => {
                setShowCheckmark(false);
            }, 1000);
        }
    }, [showCheckmark]);

    useEffect(() => {
        if (showError) {
            setTimeout(() => {
                setShowCheckmark(false);
            }, 1000);
        }
    }, [showError]);

    const handleClick = (e) => {
        e.preventDefault();

        navigator.clipboard
            .writeText(string)
            .then(() => {
                setShowCheckmark(true);
            })
            .catch((err) => {
                setShowError(true);
            });
    };

    return (
        <span className="clipboard-copier-container">
            {showCheckmark ? (
                <span className="checkmark">✓</span>
            ) : showError ? (
                <span className="x-symbol">✗</span>
            ) : (
                <span className="clipboard-symbol" onClick={handleClick}>
                    🗐
                </span>
            )}
        </span>
    );
};

export default ClipboardCopier;
