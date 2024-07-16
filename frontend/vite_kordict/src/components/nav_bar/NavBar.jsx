import React, { useContext } from "react";

import { AuthenticationInfoContext } from "../../App.jsx";
import LogoutButton from "../accounts/LogoutButton.jsx";

/**
 * A component for the nav bar at the top of the screen. Contains buttons for logging in, logging out,
 * creating an account, and the currently logged in user depending on if any user is logged in.
 *
 * @param {Object} props - Component props.
 * @param {Function} setNavState - The function that updates navigation state of user account components.
 * @returns {React.JSX.Element} The rendered NavBar component.
 */
const NavBar = ({ setNavState }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];

    return (
        <div
            className="space-children-horizontal full-width pad-10"
            style={{
                backgroundColor: "black",
            }}
        >
            <div
                className="curved-box-shape pad-10 underlined"
                style={{
                    backgroundColor: "var(--bluepurple)",
                    marginLeft: "15px",
                    fontSize: "12px",
                }}
            >
                한국어 사전
            </div>

            {authInfo["username"] ? (
                <>
                    <span style={{ zIndex: "100" }}>
                        {authInfo["username"]}님
                    </span>
                    <LogoutButton />
                </>
            ) : (
                <div>
                    <button
                        className="lrmargin-10"
                        onClick={() => {
                            setNavState("create_account");
                        }}
                    >
                        새로운 계정 만들기
                    </button>
                    <button
                        className="lrmargin-10"
                        onClick={() => {
                            setNavState("login");
                        }}
                    >
                        로그인
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavBar;
