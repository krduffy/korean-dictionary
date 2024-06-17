import React, { useContext, useEffect } from "react";

import { useAPIModifier } from "../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../App.jsx";
import UsernamePasswordForm from "./UsernamePasswordForm.jsx";

import "./account-styles.css";

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
            }, 1000);

            setAuthInfo({
                username: response.user["username"],
                token: response.token,
            });

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
