import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import "../asset/Sign.scss";
import FindData from "./FindData";
import SocialSign from "./SocialSign";
function Sign({ authService, useInput }) {
  const [id, setId] = useInput("");
  const [password, setPassword] = useInput("");
  const [findToggle, setFIndToggle] = useState(false);

  const onchangeId = useCallback(
    (e) => {
      setId(e);
    },
    [setId]
  );

  const onchangePw = useCallback(
    (e) => {
      setPassword(e);
    },
    [setPassword]
  );

  //리액트의 on 구분은 event 파라미터를 안넣줘도 자동적으로 붙음

  async function LoginLogic(e) {
    e.preventDefault();
    try {
      await authService.signInWithEmailAndPassword(id, password);
      //관습
    } catch (error) {
      if (
        error.message ===
        "The password is invalid or the user does not have a password."
      ) {
        window.alert("암호가 잘못되었거나 사용자에게 암호가 없습니다.");
      } else if (
        error.message ===
        "There is no user record corresponding to this identifier. The user may have been deleted."
      ) {
        window.alert("이메일이 존재하지않거나, 삭제된 이메일입니다.");
      } else if (
        error.message ===
        "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later."
      ) {
        window.alert(
          "로그인 시도 실패로 인해 이 계정에 대한 액세스가 일시적으로 비활성화되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다."
        );
      } else {
        window.alert(error.message);
      }
    }
  }

  function findAction(findToggle) {
    setFIndToggle(findToggle);
  }

  return (
    <>
      <div className="sign_wrap">
        <h1 className="logo">
          <img src="./img/logo.svg" alt="" />
          <figcaption className="logo_title">J.log</figcaption>
        </h1>
        <form onSubmit={LoginLogic} className="sign-form">
          <input
            type="text"
            className="form-control"
            name="id"
            placeholder="아이디"
            required
            value={id}
            onChange={onchangeId}
          />
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={onchangePw}
          />
          <button className="btn">로그인</button>
        </form>
        <SocialSign authService={authService} />
        <div className="assistance">
          <button
            className="pw_reset ass_btn"
            onClick={() => {
              setFIndToggle(!findToggle);
            }}
          >
            비밀번호 변경&amp;찾기
          </button>
          <button className="ass_auth ass_btn">
            <Link to="/Auth">회원가입</Link>
          </button>
        </div>
      </div>
      {findToggle ? (
        <FindData
          findToggle={findToggle}
          findAction={findAction}
          authService={authService}
          useInput={useInput}
        />
      ) : null}
    </>
  );
}

export default Sign;
