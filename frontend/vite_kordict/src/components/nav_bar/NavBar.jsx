import React, { useState, useEffect } from "react";
import "./navbar-styles.css";
import { isLoggedIn } from "../../../util/tokenManagement";

const NavBar = ({ loggedInUsername, setNavState, onLogout }) => {
  return (
    <div id="navbar">
      <div id="navbar-dictionary-title">한국어사전</div>

      {loggedInUsername ? (
        <React.Fragment>
          <span id="username-display">{loggedInUsername}님</span>
          <button
            id="logout-button"
            onClick={() => {
              onLogout();
            }}
          >
            로그아웃
          </button>
        </React.Fragment>
      ) : (
        <button
          id="login-button"
          onClick={() => {
            setNavState("login");
          }}
        >
          로그인
        </button>
      )}
    </div>
  );
};

export default NavBar;
