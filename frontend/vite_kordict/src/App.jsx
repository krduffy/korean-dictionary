import React, { useEffect } from "react";
import Panel from "./components/panel/Panel.jsx";
import NavBar from "./components/nav_bar/NavBar.jsx";
import "./app.css";

const App = () => {
  useEffect(() => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    console.table({ screenHeight, screenWidth });

    document.getElementById("main-page").style.height = screenHeight + "px";
    document.getElementById("main-page").style.width = screenWidth + "px";
  }, []);

  return (
    <div id="main-page">
      <div id="nav-bar-container">
        <NavBar />
      </div>
      <div id="dummy-behind-navbar"></div>

      <div id="both-panels-container">
        <div className="panel-container" id="left-panel-container">
          <Panel />
        </div>
        <div className="panel-container" id="right-panel-container">
          <Panel />
        </div>
      </div>
    </div>
  );
};

export default App;
