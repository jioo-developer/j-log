import { Link } from "react-router-dom";
import { useMyContext } from "../module/MyContext";
import { authService } from "../Firebase";
import useLoadUser from "../query/loadUser";
import { useState } from "react";
function Header() {
  const [menuToggle, setToggle] = useState(false);
  const { navigate } = useMyContext();
  const { data } = useLoadUser();
  function logout() {
    authService.signOut();
    navigate("/sign");
  }
  return (
    <header>
      {data ? (
        <>
          <p className="title">
            <Link to="/">{data.displayName}.log</Link>
          </p>

          <div className="menu" onClick={() => setToggle((prev) => !prev)}>
            <figure>
              <img
                src={data.photoURL}
                alt=""
                className="profile"
                referrerPolicy="no-referrer"
              />
            </figure>
            <img src="./img/arrow.svg" alt="" className="arrow" />
          </div>
          {menuToggle ? (
            <ul className="sub_menu">
              <li>
                <Link to="/profile">설정</Link>
              </li>
              <li onClick={logout}>로그아웃</li>
            </ul>
          ) : null}
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
      )}
    </header>
  );
}

export default Header;
