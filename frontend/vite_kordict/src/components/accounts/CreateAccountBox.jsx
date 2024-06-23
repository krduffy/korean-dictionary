import React, { useContext, useEffect } from "react";

import { useAPIModifier } from "../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../App.jsx";
import UsernamePasswordForm from "./UsernamePasswordForm.jsx";

import "./account-styles.css";

/**
 * A box component to create a new account.
 *
 * @param {Function} setNavState - setNavState, the function that updates the navigation state of user account management.
 * @returns {React.JSX.Element} The rendered CreateAccountBox component.
 */
const CreateAccountBox = ({ setNavState }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const setAuthInfo = useContext(AuthenticationInfoContext)["setAuthInfo"];

    const {
        formData,
        updateFormDataField,
        apiModify,
        successful,
        response,
        error,
    } = useAPIModifier({
        username: "",
        password: "",
    });

    {
        /* user is logged in to a new account when they create it  */
    }
    useEffect(() => {
        if (successful) {
            const timer = setTimeout(() => {
                setNavState("none");
            }, 3000);

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successful]);

    const handleSubmit = (e) => {
        e.preventDefault();
        apiModify("user/create_user/", authInfo["token"], formData, "POST");
    };

    return (
        <UsernamePasswordForm
            title={"계정 만들기"}
            setNavState={setNavState}
            handleSubmit={handleSubmit}
            updateFormDataField={updateFormDataField}
            successful={successful}
            error={error}
            response={response}
        />
    );
};

export default CreateAccountBox;
