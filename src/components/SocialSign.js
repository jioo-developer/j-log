import React from "react";
import { firebaseInstance } from "../Firebase";
function SocialSign({ authService, db }) {
  let provider;
  async function onGoogle() {
    provider = await new firebaseInstance.auth.GoogleAuthProvider();
    //데이터 받기
    await authService.signInWithPopup(provider).then((result) => {
      // goggleData.displayName = result.user.displayName;
      // goggleData.profile = result.additionalUserInfo.profile.picture.data.url;
      db.collection("nickname")
        .doc(result.user.displayName)
        .set({ nickname: result.user.displayName });
      result.user.updateProfile({
        photoURL: "./img/default.svg",
      });
    });
    // await 후 authService에서 받은 데이터 조회
  }

  async function onFacebook() {
    provider = await new firebaseInstance.auth.FacebookAuthProvider();
    //데이터 받기
    await authService.signInWithPopup(provider).then((result) => {
      // facebookData.displayName = result.user.displayName;
      // facebookData.profile = result.additionalUserInfo.profile.picture.data.url;
      //dispatch(함수(facebookData))
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
