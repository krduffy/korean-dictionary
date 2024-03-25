
import React, { useState } from "react";
import NavBar from "./components/nav_bar/NavBar.jsx";
import Panel from "./components/Panel.jsx";
import "./main_page.css"

const MainPage = () => {

  return (
    <div id="main_page">
      <NavBar />
      <div className="panels-div">
        <div className="left-panel">
          <Panel />
        </div>
        <div className="right-panel">
          <Panel />
        </div>
      </div>
    </div>
  );
}

export default MainPage;