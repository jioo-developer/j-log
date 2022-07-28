import React, { useEffect, useState } from "react";
import "../asset/auth.scss";
import { Link } from "react-router-dom";

function Auth({ navigate, authService, db, useInput }) {
  const [email, setEmail] = useInput("");
  const [password, setPassword] = useInput("");
  const [nickname, setNickname] = useState("");
  const [nickFilter, setFilter] = useState([]);
  const [check, setCheck] = useState(false);
  const [helper, setHelper] = useState(false);
  const authData = [
    { id: "auth", text: "회원가입및 운영약관 동의", important: true },
    { id: "data", text: "개인정보 수집 및 동의", important: true },
    { id: "location", text: "위치정보 이용약관 동의", important: false },
  ];

  useEffect(() => {
    db.collection("nickname").onSnapshot((snapshot) => {
      let NIckData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFilter(NIckData);
    });
  }, []);

  function joinHelper(e) {
    e.preventDefault();
    join();
  }

  function join() {
    if (nickname !== "") {
      let result = nickFilter.some((item) => {
        return item.id === nickname;
      });
      const loading = new Promise(function (resolve, reject) {
        if (result === true) {
          setNickname("");
          const nickError = "이미 사용중인 닉네임 입니다 ";
          reject({ message: nickError });
        } else {
          setNickname(nickname);
          resolve();
        }
      });
      loading
        .then(() => {
          authService
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
              db.collection("nickname")
                .doc(nickname)
                .set({ nickname: nickname });
              window.alert("회원가입을 환영합니다.");
              navigate("/");
              result.user.updateProfile({
                displayName: nickname,
                photoURL: "./img/default.svg",
              });
            });
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

  function checkHanlder(e) {
    setHelper(!helper);
    if (e.target.id === "all_check") {
      const checkboxs = document.getElementsByName("sub_check");
      checkboxs.forEach((item) => {
        item.checked = e.target.checked;
      });
    }
    const checkPromise = new Promise(function (resolve, reject) {
      const trueCheck = document.querySelectorAll(
        "input[type='checkbox']:checked:not(#all_check)"
      );
      if (trueCheck.length >= 2) {
        resolve(trueCheck.length);
      } else {
        reject(trueCheck.length);
      }

      if (trueCheck.length === 3) {
        document.getElementById("all_check").checked = true;
      } else {
        document.getElementById("all_check").checked = false;
      }
    });

    checkPromise
      .then(() => {
        setCheck(true);
      })
      .catch(() => {
        setCheck(false);
      });
  }

  useEffect(() => {
    const IsChecked = Array.from(
      document.querySelectorAll("input[type='checkbox']")
    );
    IsChecked.map((value, index) => {
      const target = value.nextElementSibling;
      if (value.checked) {
        target.style.backgroundImage = "url('./img/checked.svg')";
        target.style.border = 0;
      } else {
        target.style.backgroundImage = "";
        target.style.border = "1px solid #eee";
      }
    });
  }, [helper]);

  return (
    <div className="Auth_wrap">
      <div className="title_area">
        <Link to="/">
          <img src="./img/close-24px.svg" className="close" alt="" />
        </Link>
        <p>회원가입</p>
      </div>
      <form className="auth-form">
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
          onChange={setEmail}
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
          onChange={setPassword}
        />
        <p className="id_title">
          활동명 &nbsp;<span>*</span>
        </p>
        <input
          type="text"
          className="form-control nick-form"
          name="name"
          placeholder="활동명을 입력하세요."
          required
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
          }}
        />
        <section className="terms">
          <div className="all_check">
            <input
              type="checkbox"
              id="all_check"
              onChange={(e) => checkHanlder(e)}
            />
            <label htmlFor="all_check" className="check"></label>
            <p className="check_text">전체 약관 동의</p>
          </div>
          <ul className="check_wrap">
            {authData.map(function (data, i) {
              return (
                <li key={i}>
                  <input
                    type="checkbox"
                    id={`${data.id}_check`}
                    name="sub_check"
                    onChange={(e) => checkHanlder(e)}
                  />
                  <label htmlFor={`${data.id}_check`} className="check"></label>
                  {data.important === true ? (
                    <p className="check_text">
                      <span style={{ color: "#ff0000d9" }}>*</span>&nbsp;
                      {data.text}
                    </p>
                  ) : (
                    <p className="check_text">{data.text}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        {check ? (
          <button className="btn" onClick={(e) => joinHelper(e)}>
            회원가입
          </button>
        ) : (
          <div className="un_btn" onClick={(e) => joinHelper(e)}>
            회원가입
          </div>
        )}
      </form>
    </div>
  );
}

export default Auth;
