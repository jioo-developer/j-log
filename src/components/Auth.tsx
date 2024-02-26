import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "../asset/auth.scss";
import { Link, useNavigate } from "react-router-dom";
import { authService, db } from "../Firebase";
import useLoadNickName, { LoadNickFilter } from "../query/loadNickName";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [checkArr, setCheck] = useState<string[]>([]);
  const [disabledCheck, setDisable] = useState<boolean>(true);
  const { data } = useLoadNickName();
  const navigate = useNavigate();
  const authData = [
    { id: "auth", text: "회원가입및 운영약관 동의", important: true },
    { id: "data", text: "개인정보 수집 및 동의", important: true },
    { id: "location", text: "위치정보 이용약관 동의", important: false },
  ];

  function signHelper(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (data && data.length > 0) {
      const overlapFilter = data.some(
        (item: LoadNickFilter) => item.nickname === nickname
      );
      if (overlapFilter) {
        window.alert("이미 사용중인 닉네임 입니다.");
        setNickname("");
      } else {
        authService
          .createUserWithEmailAndPassword(email, password)
          .then((result) => {
            if (Object.entries(result).length > 0) {
              db.collection("nickname")
                .doc(nickname)
                .set({ nickname: nickname })
                .then(() => {
                  if (result.user !== null) {
                    result.user.updateProfile({
                      displayName: nickname,
                      photoURL: "./img/default.svg",
                    });
                  }
                });

              window.alert("회원가입을 환영합니다.");
              navigate("/");
            }
          })
          .catch((error) => {
            if (error.message === "The email address is badly formatted.") {
              window.alert("올바른 이메일 형식이 아닙니다.");
            } else if (
              error.message === "Password should be at least 6 characters"
            ) {
              window.alert("비밀번호가 너무짧습니다.");
            } else if (
              error.message ===
              "The email address is already in use by another account."
            ) {
              window.alert("이미 사용중인 이메일입니다.");
            } else {
              window.alert(error.message);
            }
          });
      }
    }
  }

  function checkHanlder(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.id === "all_check") {
      if (e.target.checked) {
        const allcheck = authData.map((item) => item.id);
        setCheck(allcheck);
      } else {
        setCheck([]);
      }
    } else {
      if (e.target.checked) {
        const copyArr = [...checkArr];
        copyArr.push(e.target.id);
        setCheck(copyArr);
      } else {
        const copyArr = [...checkArr];
        const result = copyArr.filter((item) => item !== e.target.id);
        setCheck(result);
      }
    }
  }

  function importantCheck() {
    const important1 = checkArr.includes("auth");
    const important2 = checkArr.includes("data");
    if (important1 && important2) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }

  useEffect(() => {
    importantCheck();
  }, [checkArr]);

  return (
    <div className="Auth_wrap">
      <div className="title_area">
        <Link to="/">
          <img src="./img/backbtn.svg" className="close" alt="" />
        </Link>
        <p>회원가입</p>
      </div>
      <form
        className="auth-form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => signHelper(e)}
      >
        <p className="id_title">
          이메일&nbsp;<span>*</span>
        </p>
        <input
          type="text"
          className="form-control"
          name="id"
          id="id"
          placeholder="이메일을 입력하세요."
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="warning">
          ※ 실제 사용하시는 이메일을 사용하셔야 비밀번호를 찾으실 수 있습니다.
        </p>
        <p className="id_title">
          비밀번호&nbsp;<span>*</span>
        </p>
        <input
          type="password"
          className="form-control"
          name="password"
          placeholder="8자리 이상 입력하세요."
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="id_title">
          닉네임 &nbsp;<span>*</span>
        </p>
        <input
          type="text"
          className="form-control nick-form"
          name="name"
          placeholder="활동명을 입력하세요."
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <section className="terms">
          <div className="all_check">
            <input
              type="checkbox"
              id="all_check"
              checked={checkArr.length === authData.length}
              onChange={(e: ChangeEvent<HTMLInputElement>) => checkHanlder(e)}
            />
            <label
              htmlFor="all_check"
              className="check"
              style={
                checkArr.length === authData.length
                  ? { border: 0 }
                  : { border: "1px solid #eee" }
              }
            >
              {checkArr.length === authData.length ? (
                <img src="./img/checked.svg" alt="체크" />
              ) : null}
            </label>
            <p className="check_text">전체 약관 동의</p>
          </div>
          <ul className="check_wrap">
            {authData.map(function (data, index) {
              return (
                <li key={index}>
                  <input
                    type="checkbox"
                    className="eachCheckbox"
                    id={data.id}
                    name="sub_check"
                    checked={checkArr.includes(data.id)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      checkHanlder(e)
                    }
                  />
                  <label
                    htmlFor={data.id}
                    className="check"
                    style={
                      checkArr.includes(data.id)
                        ? { border: 0 }
                        : { border: "1px solid #eee" }
                    }
                  >
                    {checkArr.includes(data.id) ? (
                      <img src="./img/checked.svg" alt="체크" />
                    ) : null}
                  </label>
                  <p className="check_text">
                    {data.important ? (
                      <span style={{ color: "#ff0000d9" }}>*&nbsp;</span>
                    ) : null}
                    {data.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
        <button
          className={!disabledCheck ? "btn" : "un_btn"}
          disabled={disabledCheck}
          type="submit"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Auth;
