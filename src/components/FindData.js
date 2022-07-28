import React, { useCallback } from "react";
function FindData({ findToggle, findAction, authService, useInput }) {
  let [findPw, setFindPw] = useInput("");

  const findPassword = useCallback(
    (e) => {
      setFindPw(e);
    },
    [setFindPw]
  );

  async function resetpw(e) {
    e.preventDefault();
    if (findPw !== "") {
      await authService
        .sendPasswordResetEmail(findPw)
        .then(() => {
          window.alert("입력하신 메일로 비밀번호 안내드렸습니다.");
          findAction(!findToggle);
        })
        .catch((error) => {
          if (
            error.massage ===
            "There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            window.alert("해당 이메일이 존재하지 않습니다");
          }
        });
    }
  }

  return (
    <section className="find">
      <div className="find_wrap">
        <p>비밀번호를 잊어 버리셨나요?</p>
        <form className="find-form" onSubmit={resetpw}>
          <input
            type="text"
            className="form-control"
            placeholder="이메일을 입력하세요."
            required
            value={findPw}
            onChange={findPassword}
          />
          <div className="btn_wrap">
            <div
              className="btn"
              onClick={() => {
                findAction(!findToggle);
              }}
            >
              취소
            </div>
            <button className="btn">완료</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default FindData;
