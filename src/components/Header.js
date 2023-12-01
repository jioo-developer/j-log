import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PostLoad } from "../index";
function Header({ user, logoutHanlder, dispatch }) {
  const [navToggle, setNavToggle] = useState(false);
  const [loginAwait, setAwait] = useState(false);
  const navigate = useNavigate();
  function logout() {
    authService.signOut();
    setNavToggle((prev) => !prev);
    logoutHanlder(null);
    dispatch(PostLoad([]));
    navigate("/");
  }

  useEffect(() => {
    setTimeout(() => {
      setAwait(true);
    }, 500);
  }, []);

  return (
    <header>
      {loginAwait ? (
        user ? (
          <>
            <p className="title">
              <Link to="/">{user.displayName}.log</Link>
            </p>

            <div className="menu" onClick={() => setNavToggle((prev) => !prev)}>
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
          <>
            <p className="not-login-logo">
              <Link to="/">J-LOG</Link>
            </p>
            <button className="loginBtn" onClick={() => navigate("/sign")}>
              로그인
            </button>
          </>
        )
      ) : null}

      {navToggle ? (
        <ul className="sub_menu">
          <li onClick={() => setNavToggle((prev) => !prev)}>
            <Link to="/profile">설정</Link>
          </li>
          <li onClick={logout}>로그아웃</li>
        </ul>
      ) : null}
    </header>
  );
}

export default Header;
