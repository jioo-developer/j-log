import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../asset/Sign.scss";
import FindData from "./FindData";
import SocialSign from "./SocialSign";
import { authService } from "../Firebase";
import { LoadUserHookResult } from "../query/loadUser";
function Sign({
  data,
  refetch,
}: {
  data: LoadUserHookResult | undefined;
  refetch: any;
}) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [findToggle, setFIndToggle] = useState(false);
  const [disabled, setDisable] = useState(false);
  const navigate = useNavigate();

  async function LoginLogic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await authService
      .signInWithEmailAndPassword(id, password)
      .then(() => {
        refetch();
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          window.alert("유효하지 않은 이메일 주소입니다.");
        } else if (error.code === "auth/user-disabled") {
          window.alert("사용자 계정이 비활성화되었습니다.");
        } else if (error.code === "auth/user-not-found") {
          window.alert("사용자를 찾을 수 없습니다.");
        } else if (error.code === "auth/wrong-password") {
          window.alert("잘못된 비밀번호입니다.");
        } else {
          window.alert(error.message);
        }
      });
  }

  function findAction(value: boolean) {
    setFIndToggle(value);
  }

  useEffect(() => {
    if (data) setDisable(true);
    else setDisable(false);
  }, [data]);

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
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" disabled={disabled}>
            로그인
          </button>
        </form>
        <SocialSign data={data} refetch={refetch} />
        <div className="assistance">
          <button
            className="pw_reset ass_btn"
            onClick={() => setFIndToggle((prev) => !prev)}
          >
            비밀번호 변경&amp;찾기
          </button>
          <button className="ass_auth ass_btn">
            <Link to="/Auth">회원가입</Link>
          </button>
        </div>
      </div>
      {findToggle ? <FindData findAction={findAction} /> : null}
    </>
  );
}

export default Sign;
