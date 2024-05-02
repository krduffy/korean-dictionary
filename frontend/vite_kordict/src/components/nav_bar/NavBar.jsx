import React from "react";
import "./navbar-styles.css";

const NavBar = ({ setNavState }) => {
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
    </div>
  );
};

export default NavBar;
