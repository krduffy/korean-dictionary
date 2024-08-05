import React, { createContext, useEffect, useState } from "react";

import {
    DATABASE_NOW_AVAILABLE_LOAD_TIME_MS,
    DATABASE_UNAVAILABLE_MESSAGE_BUFFER_TIME_MS,
} from "./constants.js";
import { useBackendPoller } from "./hooks/useBackendPoller.js";

import CreateAccountBox from "./components/accounts/CreateAccountBox.jsx";
import LoginBox from "./components/accounts/LoginBox.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import Panel from "./components/panel/Panel.jsx";
import { LoadingMessage } from "./components/panel/messages/LoadingMessage.jsx";

import "./app.css";

export const AuthenticationInfoContext = createContext(null);

const App = () => {
    /* navState is for navigation state (make new account, login, logout, etc) in the 
       accounts context */
    const [navState, setNavState] = useState(null);
    const [authInfo, setAuthInfo] = useState({});

    const { backendAvailable } = useBackendPoller();
    const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
    const [showDictionary, setShowDictionary] = useState(false);

    useEffect(() => {
        if (backendAvailable) {
            console.log("HI");
            setTimeout(() => {
                setShowDictionary(true);
            }, DATABASE_NOW_AVAILABLE_LOAD_TIME_MS);
        } else {
            setShowDictionary(false);
        }
    }, [backendAvailable]);

    setTimeout(
        () => setShowUnavailableMessage(true),
        DATABASE_UNAVAILABLE_MESSAGE_BUFFER_TIME_MS
    );

    return !backendAvailable && showUnavailableMessage ? (
        <div
            className="center-on-screen curved-box"
            style={{ marginTop: "50px", fontSize: "large", width: "25%" }}
        >
            <div className="pad-10 full-width textcentered">
                서버에 접속할 수 없는 것 같습니다.
            </div>
            <div className="pad-10 full-width textcentered">
                다커 컨데이너를 방금 작동하셨다면 이 페이지에 잠깐 기다리십시오.
            </div>
        </div>
    ) : backendAvailable && !showDictionary ? (
        <div style={{ marginTop: "50px" }}>
            <LoadingMessage />
        </div>
    ) : (
        backendAvailable &&
        showDictionary && (
            <div id="main-page">
                <AuthenticationInfoContext.Provider
                    value={{
                        authInfo: authInfo,
                        setAuthInfo: setAuthInfo,
                    }}
                >
                    <div id="nav-bar-container">
                        <NavBar setNavState={setNavState} />
                    </div>

                    <div className="blue-bar" />

                    <div id="both-panels-container">
                        <div
                            className="panel-container"
                            id="left-panel-container"
                        >
                            <Panel />
                        </div>
                        <div
                            className="panel-container"
                            id="right-panel-container"
                        >
                            <Panel />
                        </div>
                    </div>

                    <div>
                        {navState === "login" && (
                            <LoginBox setNavState={setNavState} />
                        )}
                        {navState === "create_account" && (
                            <CreateAccountBox setNavState={setNavState} />
                        )}
                    </div>
                </AuthenticationInfoContext.Provider>
            </div>
        )
    );
};

export default App;
