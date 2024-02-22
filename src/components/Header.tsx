import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMyContext } from "../module/MyContext";
function Header() {
  const { navigate, authService, userData } = useMyContext();
  function logout() {
    authService.signOut();
    navigate("/");
  }
  return (
    <header>
      <p className="title">
        <Link to="/">{userData.displayName}.log</Link>
      </p>

      <div className="menu" onClick={() => setNavToggle((prev) => !prev)}>
        <img
          src={userData.photoURL}
          alt=""
          className="profile"
          referrerPolicy="no-referrer"
        />
        <img src="./img/arrow.svg" alt="" className="arrow" />
      </div>
      <p className="not-login-logo">
        <Link to="/">J-LOG</Link>
      </p>
      <button className="loginBtn" onClick={() => navigate("/sign")}>
        로그인
      </button>
      <ul className="sub_menu">
        <li onClick={() => setNavToggle((prev) => !prev)}>
          <Link to="/profile">설정</Link>
        </li>
        <li onClick={logout}>로그아웃</li>
      </ul>
    </header>
  );
}

export default Header;
