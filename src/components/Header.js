import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoginAction } from "..";
function Header({ user, dispatch, logoutHanlder }) {
  const [navToggle, setNavToggle] = useState(false);
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.login);
  function logout() {
    authService.signOut();
    dispatch(LoginAction());
    setNavToggle(!navToggle);
    logoutHanlder(null);
  }

  return (
    <header>
      {user && loginState ? (
        <>
          <p className="title">
            <Link to="/">{user.displayName}.log</Link>
          </p>
          <div
            className="menu"
            onClick={() => {
              setNavToggle(!navToggle);
            }}
          >
            <img
              src={user.photoURL}
              alt=""
              className="profile"
              referrerPolicy="no-referrer"
            />
            <img src="./img/arrow.svg" alt="" className="arrow" />
          </div>
        </>
      ) : (
        <button className="loginBtn" onClick={() => navigate("/sign")}>
          로그인
        </button>
      )}
      {navToggle ? (
        <ul className="sub_menu">
          <li>
            <Link to="/profile">설정</Link>
          </li>
          <li onClick={logout}>로그아웃</li>
        </ul>
      ) : null}
    </header>
  );
}

export default Header;
