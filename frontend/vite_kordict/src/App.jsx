import React, { createContext, useEffect, useState } from "react";

import {
    DATABASE_NOW_AVAILABLE_LOAD_TIME_MS,
    DATABASE_UNAVAILABLE_MESSAGE_BUFFER_TIME_MS,
} from "./constants.js";
import { useBackendPoller } from "./hooks/useBackendPoller.js";
import { useDictionaryPanels } from "./hooks/useDictionaryPanels.js";

import CreateAccountBox from "./components/accounts/CreateAccountBox.jsx";
import LoginBox from "./components/accounts/LoginBox.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import Panel from "./components/panel/Panel.jsx";
import {
    LoadingMessage,
    TrailingDotCustomMessage,
} from "./components/panel/messages/LoadingMessage.jsx";

import "./app.css";

export const AuthenticationInfoContext = createContext(null);

const App = () => {
    const { backendAvailable } = useBackendPoller();
    const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
    const [showDictionary, setShowDictionary] = useState(false);

    useEffect(() => {
        if (backendAvailable) {
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
        <BackendUnavailablePage />
    ) : backendAvailable && !showDictionary ? (
        <div style={{ marginTop: "50px" }}>
            <LoadingMessage />
        </div>
    ) : (
        backendAvailable && showDictionary && <DictionaryPage />
    );
};

export default App;

const BackendUnavailablePage = () => {
    return (
        <div
            className="center-on-screen curved-box"
            style={{ marginTop: "50px", fontSize: "large", width: "25%" }}
        >
            <div className="pad-10 full-width textcentered">
                서버에 접속할 수 없는 것 같습니다.
            </div>
            <div className="pad-10 full-width textcentered">
                다커 컨테이너를 방금 작동하셨다면 이 페이지에 잠깐 기다리십시오.
            </div>

            <div className="pad-10 textcentered">
                <TrailingDotCustomMessage customMessage={"접속하려는 중"} />
            </div>
        </div>
    );
};

const DictionaryPage = () => {
    /* navState is for navigation state (make new account, login, logout, etc) in the 
       accounts context */
    const [navState, setNavState] = useState(null);
    const [authInfo, setAuthInfo] = useState({});

    const { useLeftPanel, useRightPanel } = useDictionaryPanels();

    return (
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
                    <div className="panel-container" id="left-panel-container">
                        <Panel panelFuncs={useLeftPanel} />
                    </div>
                    <div className="panel-container" id="right-panel-container">
                        <Panel panelFuncs={useRightPanel} />
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
    );
};
