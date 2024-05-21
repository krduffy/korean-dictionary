import { isLoggedIn } from "../../../util/tokenManagement";

import React, { useEffect, useState } from "react";

import "./navbar-styles.css";

const NavBar = ({ loggedInUsername, setNavState, onLogout }) => {
    return (
        <div id="navbar">
            <div id="navbar-dictionary-title">한국어사전</div>

            {loggedInUsername ? (
                <React.Fragment>
                    <span id="username-display">{loggedInUsername}님</span>
                    <button
                        id="logout-button"
                        onClick={() => {
                            onLogout();
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
