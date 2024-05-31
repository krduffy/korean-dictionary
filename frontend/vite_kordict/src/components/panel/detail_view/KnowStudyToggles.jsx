import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

import "./styles/korean-word-view-styles.css";

const KnowStudyToggles = ({ targetCode, initiallyKnown, initiallyStudied }) => {
    return (
        <>
            <KnownOrUnknownView
                targetCode={targetCode}
                initiallyKnown={initiallyKnown}
            />
            <StudiedOrNotStudiedView
                targetCode={targetCode}
                initiallyStudied={initiallyStudied}
            />
        </>
    );
};

KnowStudyToggles.propTypes = {
    targetCode: PropTypes.number.isRequired,
    initiallyKnown: PropTypes.bool.isRequired,
    initiallyStudied: PropTypes.bool.isRequired,
};

export default KnowStudyToggles;

const KnownOrUnknownView = ({ targetCode, initiallyKnown }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiModify, successful, error } = useAPIModifier({});
    const [wordIsKnown, setWordIsKnown] = useState(initiallyKnown);

    useEffect(() => {
        setWordIsKnown(initiallyKnown);
    }, [initiallyKnown]);

    const handleClick = () => {
        const method = wordIsKnown ? "DELETE" : "PUT";

        apiModify(
            `http://127.0.0.1:8000/api/toggle_word_known/${targetCode}`,
            authInfo["token"],
            "",
            method
        );
    };

    useEffect(() => {
        if (successful) {
            setWordIsKnown(!wordIsKnown);
        }
    }, [successful]);

    useEffect(() => {
        if (error) {
            /* handle */
        }
    }, [error]);

    return (
        <span
            className={
                wordIsKnown ? "known-word-button" : "unknown-word-button"
            }
            style={{ cursor: "pointer" }}
            onClick={() => {
                handleClick();
            }}
            title={
                wordIsKnown
                    ? "클릭하여 아는 단어장에서 제거"
                    : "클릭하여 아는 단어장에 추가"
            }
        >
            {wordIsKnown ? "✅︎" : "？"}
        </span>
    );
};

KnownOrUnknownView.propTypes = {
    targetCode: PropTypes.number.isRequired,
    initiallyKnown: PropTypes.bool.isRequired,
};

const StudiedOrNotStudiedView = ({ targetCode, initiallyStudied }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiModify, successful, error } = useAPIModifier({});
    const [wordIsStudied, setWordIsStudied] = useState(initiallyStudied);

    useEffect(() => {
        setWordIsStudied(initiallyStudied);
    }, [initiallyStudied]);

    const handleClick = () => {
        const method = wordIsStudied ? "DELETE" : "PUT";
        apiModify(
            `http://127.0.0.1:8000/api/toggle_word_studied/${targetCode}`,
            authInfo["token"],
            "",
            method
        );
    };

    useEffect(() => {
        if (successful) {
            setWordIsStudied(!wordIsStudied);
        }
    }, [successful]);

    useEffect(() => {
        if (error) {
            /* handle */
        }
    }, [error]);

    return (
        <span
            className={
                wordIsStudied
                    ? "studied-word-button"
                    : "not-studied-word-button"
            }
            style={{ cursor: "pointer" }}
            onClick={() => {
                handleClick();
            }}
            title={
                wordIsStudied
                    ? "클릭하여 암기장에서 제거"
                    : "클릭하여 암기장에 추가"
            }
        >
            {wordIsStudied ? "★" : "☆"}
        </span>
    );
};

StudiedOrNotStudiedView.propTypes = {
    targetCode: PropTypes.number.isRequired,
    initiallyStudied: PropTypes.bool.isRequired,
};
