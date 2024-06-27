import React, { useContext } from "react";

import { useAPIModifier } from "../../hooks/useAPIModifier.js";

import { AuthenticationInfoContext } from "../../App.jsx";

const LogoutButton = () => {
    const setAuthInfo = useContext(AuthenticationInfoContext)["setAuthInfo"];
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    const { apiModify } = useAPIModifier();

    return (
        <button
            id="logout-button"
            onClick={() => {
                apiModify("user/logout/", authInfo["token"], {}, "POST");
                setAuthInfo({});
            }}
        >
            로그아웃
        </button>
    );
};

export default LogoutButton;
