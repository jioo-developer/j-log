import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../Firebase";
import { useNavigate } from "react-router-dom";
function Header({ user }) {
  const [navToggle, setNavToggle] = useState(false);
  const [lazyloading, setlazy] = useState(false);
  const navigate = useNavigate();
  function logout() {
    authService.signOut();
    navigate("/");
  }

  useEffect(() => {
    setTimeout(() => {
      setlazy(true);
    }, 800);
  }, []);

  return (
    <>
      <header>
        {lazyloading ? (
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
              <img src={user.photoURL} alt="" className="profile" />
              <img src="./img/arrow.svg" alt="" className="arrow" />
            </div>
          </>
        ) : (
          "로그인정보를 가져오는중..."
        )}
      </header>
      {navToggle ? (
        <>
          <ul className="sub_menu">
            <li>
              <Link to="/profile">설정</Link>
            </li>
            <li onClick={logout}>로그아웃</li>
          </ul>
        </>
      ) : null}
    </>
  );
}

export default Header;
