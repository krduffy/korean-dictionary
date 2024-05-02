import React, { useState } from "react";
import LoginBox from "./LoginBox.jsx";
import "./navbar-styles.css";

const NavBar = () => {
  const [navState, setNavState] = useState(null);

  return (
    <div id="navbar">
      <span>한국어사전</span>

      <span>님</span>
      <button
        onClick={() => {
          setNavState("login");
        }}
      >
        로그인
      </button>
      <span>새로운 계정 만들기</span>

      {navState === "login" && <LoginBox setNavState={setNavState} />}
    </div>
  );
};

export default NavBar;
