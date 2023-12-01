import React from "react";
import { firebaseInstance } from "../Firebase";
function SocialSign({ authService, db }) {
  let provider;
  async function onGoogle() {
    provider = await new firebaseInstance.auth.GoogleAuthProvider();
    //데이터 받기
    await authService.signInWithPopup(provider).then((result) => {
      if (!localStorage.getItem("authCookie")) {
        localStorage.setItem("authCookie", true);
        const newPassword = window.prompt(
          "소셜로그인에선 2차비밀번호를 설정하셔야합니다."
        );
        result.user.updatePassword(newPassword);
        db.collection("nickname")
          .doc(result.user.displayName)
          .set({ nickname: result.user.displayName });
      }
    });
    // await 후 authService에서 받은 데이터 조회
  }

  async function onFacebook() {
    provider = await new firebaseInstance.auth.FacebookAuthProvider();
    //데이터 받기
    await authService.signInWithPopup(provider).then((result) => {
      if (!localStorage.getItem("authCookie")) {
        localStorage.setItem("authCookie", true);
        const newPassword = window.prompt(
          "소셜로그인에선 2차비밀번호를 설정하셔야합니다."
        );
        result.user.updatePassword(newPassword);
        // db.collection("nickname")
        //   .doc(result.user.displayName)
        //   .set({ nickname: result.user.displayName });
      }
    });
    // await 후 authService에서 받은 데이터 조회
  }

  return (
    <div className="sns_sign">
      <button className="sns-btn" name="google" onClick={onGoogle}>
        <img src="./img/google.svg" alt="" />
        <figcaption className="btn_title">구글로 시작하기</figcaption>
      </button>
      <button className="sns-btn" name="facebook" onClick={onFacebook}>
        <img src="./img/facebook.svg" alt="" />
        <figcaption className="btn_title">페이스북으로 시작하기</figcaption>
      </button>
    </div>
  );
}

export default SocialSign;
