import React, { useState, useEffect } from "react";
import "./navbar-styles.css";
import { isLoggedIn } from "../../../util/tokenManagement";

const NavBar = ({ loggedInUsername, setNavState }) => {
  return (
    <div id="navbar">
      <span>한국어사전</span>

      {loggedInUsername && <span>{loggedInUsername}님</span>}
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
