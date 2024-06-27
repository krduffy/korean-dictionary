import React, { useContext } from "react";

import { AuthenticationInfoContext } from "../../App.jsx";

import "./navbar-styles.css";

/**
 * A component for the nav bar at the top of the screen. Contains buttons for logging in, logging out,
 * creating an account, and the currently logged in user depending on if any user is logged in.
 *
 * @param {Object} props - Component props.
 * @param {Function} setNavState - The function that updates navigation state of user account components.
 * @returns {React.JSX.Element} The rendered NavBar component.
 */
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
                <div>
                    <button
                        id="create-account-button"
                        onClick={() => {
                            setNavState("create_account");
                        }}
                    >
                        새로운 계정 만들기
                    </button>
                    <button
                        id="login-button"
                        onClick={() => {
                            setNavState("login");
                        }}
                    >
                        로그인
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavBar;
