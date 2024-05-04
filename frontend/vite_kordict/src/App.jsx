import React, { useState, useEffect } from "react";
import Panel from "./components/panel/Panel.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import "./app.css";
import LoginBox from "./components/LoginBox.jsx";
import { loginIsExpired } from "../util/tokenManagement.js";

const App = () => {
  const [navState, setNavState] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(
    localStorage.getItem("username"),
  );

  useEffect(() => {
    /* check local storage to auto log in if there is already something there */
    if (loginIsExpired()) {
      localStorage.clear();
    }
  }, []);

  const onLogout = () => {
    localStorage.clear();
    setLoggedInUsername(null);
  };

  return (
    <div id="main-page">
      <div id="nav-bar-container">
        <NavBar
          loggedInUsername={loggedInUsername}
          setNavState={setNavState}
          onLogout={onLogout}
        />
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
          <LoginBox
            setLoggedInUsername={setLoggedInUsername}
            setNavState={setNavState}
          />
        )}
      </div>
    </div>
  );
};

export default App;
