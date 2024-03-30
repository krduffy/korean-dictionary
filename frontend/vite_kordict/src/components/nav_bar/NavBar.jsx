import React, { useState, useEffect } from "react";
import "./navbar.css";

const NavBar = () => {
  return (
    <div id="navbar">
      <span>한국어사전</span>

      <button>한</button>
      <button>漢</button>
      <button>연습</button>
    </div>
  );
};

export default NavBar;
