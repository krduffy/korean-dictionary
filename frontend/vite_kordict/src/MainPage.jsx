
import React, { useState } from "react";
import NavBar from "./components/nav_bar/NavBar.jsx";
import Panel from "./components/Panel.jsx";
import "./main_page.css"

const MainPage = () => {

  return (
    <div id="main-page">
      <NavBar />
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
}

export default MainPage;