import React, { createContext, useState } from "react";

import CreateAccountBox from "./components/accounts/CreateAccountBox.jsx";
import LoginBox from "./components/accounts/LoginBox.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import Panel from "./components/panel/Panel.jsx";

import "./app.css";

export const AuthenticationInfoContext = createContext(null);

const App = () => {
    /* navState is for navigation state (make new account, login, logout, etc) in the 
       accounts context */
    const [navState, setNavState] = useState(null);
    const [authInfo, setAuthInfo] = useState({});

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

                <div id="both-panels-container">
                    <div className="panel-container" id="left-panel-container">
                        <Panel />
                    </div>
                    <div className="panel-container" id="right-panel-container">
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
    );
};

export default App;
