import { Link, useNavigate } from "react-router-dom";
import { authService } from "../Firebase";
import { useState } from "react";
import { LoadUserHookResult } from "../query/loadUser";

type headerProps = {
  data: LoadUserHookResult | undefined;
  refetch: any;
};
function Header({ data, refetch }: headerProps) {
  const [menuToggle, setToggle] = useState(false);
  const navigate = useNavigate();
  function logout() {
    authService.signOut().then(() => {
      navigate("/sign");
      refetch();
    });
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
                <Link to="/profile" onClick={() => setToggle(false)}>
                  설정
                </Link>
              </li>
              <li onClick={() => logout()}>로그아웃</li>
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
