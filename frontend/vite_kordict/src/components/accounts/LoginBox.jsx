import React, { useContext, useEffect } from "react";

import { useAPIModifier } from "../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../App.jsx";
import UsernamePasswordForm from "./UsernamePasswordForm.jsx";

import "./account-styles.css";

const LoginBox = ({ setNavState }) => {
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
        /* for when user clicks to log in and it is successful; automatically
       gets rid of the login box. */
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
        apiModify("user/login/", authInfo["token"], formData, "POST");
    };

    return (
        <UsernamePasswordForm
            title={"로그인"}
            setNavState={setNavState}
            handleSubmit={handleSubmit}
            updateFormDataField={updateFormDataField}
            successful={successful}
            error={error}
            response={response}
        />
    );
};

export default LoginBox;
