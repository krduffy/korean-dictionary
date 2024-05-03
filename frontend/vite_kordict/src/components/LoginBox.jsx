import React, { useEffect } from "react";
import { useAPIPoster } from "./panel/useAPIPoster";
import "./account-styles.css";

const LoginBox = ({ setNavState }) => {
  const {
    formData,
    updateFormDataField,
    apiPost,
    successful,
    response,
    error,
  } = useAPIPoster({
    username: "",
    password: "",
  });

  {
    /* for when user clicks to log in and it is successful; automatically
       gets rid of the login box. */
  }
  useEffect(() => {
    if (successful) {
      const timer = setTimeout(() => {
        setNavState("none");
      }, 1000);

      // Clear the timeout to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [successful]);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiPost("http://127.0.0.1:8000/user/login/", formData);
  };

  return (
    <div className="login-box">
      <div id="login-form-top-strip">
        <span id="login-form-header">로그인</span>
        <button
          id="cancel-login-button"
          onClick={() => {
            setNavState("none");
          }}
        >
          ✖
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="username" className="login-label">
            아이디
          </label>
          <input
            className="login-input"
            type="text"
            name="username"
            onChange={(e) => {
              updateFormDataField("username", e.target.value);
            }}
          ></input>
        </div>
        <div className="input-container">
          <label htmlFor="password" className="login-label">
            비밀번호
          </label>
          <input
            className="login-input"
            type="password"
            name="password"
            onChange={(e) => {
              updateFormDataField("password", e.target.value);
            }}
          ></input>
        </div>

        <div id="submit-and-message-container">
          <div id="messages-container">
            {successful && <span id="login-success-message">로그인 성공</span>}
            {error && response && response.non_field_errors && (
              <span id="login-fail-message">
                {response.non_field_errors[0]}
              </span>
            )}
          </div>
          <button id="submit-login-button" onClick={handleSubmit}>
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginBox;
