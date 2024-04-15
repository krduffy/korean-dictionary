import React from "react";
import Panel from "./components/panel/Panel.jsx";
import "./app.css";

const App = () => {
  return (
    <div id="main-page">
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
