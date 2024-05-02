import React, { useEffect } from "react";
import { useAPIPoster } from "../panel/useAPIPoster";
import "./navbar-styles.css";

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
    /* for when user clicks to log in and it is successful */
  }
  useEffect(() => {
    if (successful) {
      const timer = setTimeout(() => {
        setNavState("none");
      }, 300);

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
      <div>로그인</div>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            name="username"
            onChange={(e) => {
              updateFormDataField("username", e.target.value);
            }}
          ></input>
        </div>

        <div className="input-container">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            onChange={(e) => {
              updateFormDataField("password", e.target.value);
            }}
          ></input>
        </div>

        <button onClick={handleSubmit}>로그인</button>
      </form>

      {successful && <div>로그인 성공</div>}
      {error && <div></div>}
    </div>
  );
};

export default LoginBox;
