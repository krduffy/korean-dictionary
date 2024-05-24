import React, { useContext } from "react";

import { AuthenticationInfoContext } from "../../App.jsx";

import "./navbar-styles.css";

const NavBar = ({ setNavState }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const setAuthInfo = useContext(AuthenticationInfoContext)["setAuthInfo"];

    return (
        <div id="navbar">
            <div id="navbar-dictionary-title">한국어사전</div>

            {authInfo["username"] ? (
                <React.Fragment>
                    <span id="username-display">{authInfo["username"]}님</span>
                    <button
                        id="logout-button"
                        onClick={() => {
                            setAuthInfo({});
                        }}
                    >
                        로그아웃
                    </button>
                </React.Fragment>
            ) : (
                <button
                    id="login-button"
                    onClick={() => {
                        setNavState("login");
                    }}
                >
                    로그인
                </button>
            )}
        </div>
    );
};

export default NavBar;
