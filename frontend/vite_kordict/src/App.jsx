import React, { useState, useEffect } from "react";
import Panel from "./components/panel/Panel.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import "./app.css";
import LoginBox from "./components/LoginBox.jsx";
import { loginIsExpired } from "../util/tokenManagement.js";

const App = () => {
  const [navState, setNavState] = useState(null);

  useEffect(() => {
    /* check local storage to auto log in if there is already something there */
    if (loginIsExpired()) {
      localStorage.clear();
    }
  }, []);

  return (
    <div id="main-page">
      <div id="nav-bar-container">
        <NavBar
          loggedInUsername={localStorage.getItem("username")}
          setNavState={setNavState}
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
        {navState === "login" && <LoginBox setNavState={setNavState} />}
      </div>
    </div>
  );
};

export default App;
