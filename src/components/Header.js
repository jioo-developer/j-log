import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../Firebase";
import { useNavigate } from "react-router-dom";
function Header({ user }) {
  const [navToggle, setNavToggle] = useState(false);
  const navigate = useNavigate();
  function logout() {
    authService.signOut();
    navigate("/");
  }

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <header>
      {user ? (
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
        <button className="loginBtn">로그인</button>
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
