import React, { useState } from "react";
import Panel from "./components/panel/Panel.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import "./app.css";
import LoginBox from "./components/LoginBox.jsx";

const App = () => {
  const [navState, setNavState] = useState(null);

  return (
    <div id="main-page">
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
        {navState === "login" && <LoginBox setNavState={setNavState} />}
      </div>
    </div>
  );
};

export default App;
