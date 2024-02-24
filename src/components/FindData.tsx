import { FormEvent, useState } from "react";
import { authService } from "../Firebase";
function FindData({ findAction }: { findAction: (params: boolean) => void }) {
  let [findPw, setFindPw] = useState("");

  function resetpw(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    authService
      .sendPasswordResetEmail(findPw)
      .then(() => {
        window.alert("입력하신 메일로 비밀번호 안내드렸습니다.");
        findAction(false);
      })
      .catch((error) => {
        if (error instanceof Error) {
          if (
            error.message ===
            "There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            window.alert("해당 이메일이 존재하지 않습니다");
          }
        }
      });
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
            onChange={(e) => setFindPw(e.target.value)}
          />
          <div className="btn_wrap">
            <div className="btn" onClick={() => findAction(false)}>
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
