import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIModifier } from "../../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

/**
 * A component to render buttons for toggling whether a word is known/not known or studied/not
 * studied by the authenticated user.
 *
 * @param {Object} props - Component props.
 * @param {number} props.targetCode - The target code for the word.
 * @param {boolean} props.initiallyKnown - Whether this word was known by the user when the component initially renders.
 * @param {boolean} props.initiallyStudied - Whether this word was studied by the user when the component initially renders.
 * @returns {React.JSX.Element} The rendered KnownStudyToggles component.
 */
const KnowStudyToggles = ({ targetCode, initiallyKnown, initiallyStudied }) => {
    return (
        <div>
            <KnownOrUnknownButton
                targetCode={targetCode}
                initiallyKnown={initiallyKnown}
            />
            <StudiedOrNotStudiedButton
                targetCode={targetCode}
                initiallyStudied={initiallyStudied}
            />
        </div>
    );
};

KnowStudyToggles.propTypes = {
    targetCode: PropTypes.number.isRequired,
    initiallyKnown: PropTypes.bool.isRequired,
    initiallyStudied: PropTypes.bool.isRequired,
};

export default KnowStudyToggles;

/**
 * A component to render a button for toggling whether a word is known/not known by the
 * authenticated user.
 *
 * @param {Object} props - Component props.
 * @param {number} props.targetCode - The target code for the word.
 * @param {boolean} props.initiallyKnown - Whether this word was known by the user when the component initially renders.
 * @returns {React.JSX.Element} The rendered KnownOrUnknownView component.
 */
const KnownOrUnknownButton = ({ targetCode, initiallyKnown }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiModify, successful, error } = useAPIModifier({});
    const [wordIsKnown, setWordIsKnown] = useState(initiallyKnown);

    useEffect(() => {
        setWordIsKnown(initiallyKnown);
    }, [initiallyKnown]);

    const handleClick = () => {
        const method = wordIsKnown ? "DELETE" : "PUT";

        apiModify(
            `api/toggle_word_known/${targetCode}`,
            authInfo["token"],
            "",
            method
        );
    };

    useEffect(() => {
        if (successful) {
            setWordIsKnown(!wordIsKnown);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successful]);

    useEffect(() => {
        if (error) {
            /* handle */
        }
    }, [error]);

    return (
        <span
            className="pointer pad-10 round-corners"
            style={{ backgroundColor: wordIsKnown ? "blueviolet" : "gray" }}
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

KnownOrUnknownButton.propTypes = {
    targetCode: PropTypes.number.isRequired,
    initiallyKnown: PropTypes.bool.isRequired,
};

/**
 * A component to render a button for toggling whether a word is studied/not studied by the
 * authenticated user.
 *
 * @param {Object} props - Component props.
 * @param {number} props.targetCode - The target code for the word.
 * @param {boolean} props.initiallyStudied - Whether this word was known by the user when the component initially renders.
 * @returns {React.JSX.Element} The rendered KnownOrUnknownView component.
 */
const StudiedOrNotStudiedButton = ({ targetCode, initiallyStudied }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const { apiModify, successful, error } = useAPIModifier({});
    const [wordIsStudied, setWordIsStudied] = useState(initiallyStudied);

    useEffect(() => {
        setWordIsStudied(initiallyStudied);
    }, [initiallyStudied]);

    const handleClick = () => {
        const method = wordIsStudied ? "DELETE" : "PUT";
        apiModify(
            `api/toggle_word_studied/${targetCode}`,
            authInfo["token"],
            "",
            method
        );
    };

    useEffect(() => {
        if (successful) {
            setWordIsStudied(!wordIsStudied);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successful]);

    useEffect(() => {
        if (error) {
            /* handle */
        }
    }, [error]);

    return (
        <span
            className="pointer pad-10 round-corners"
            style={{ backgroundColor: wordIsStudied ? "#946821" : "gray" }}
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

StudiedOrNotStudiedButton.propTypes = {
    targetCode: PropTypes.number.isRequired,
    initiallyStudied: PropTypes.bool.isRequired,
};
