import React from 'react'
import {  firebaseInstance } from "../Firebase";
function SocialSign({authService}) {
    let provider;
    let facebookData = {}
    async function onGoogle() {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
        //데이터 받기 
        await authService.signInWithPopup(provider)
        // await 후 authService에서 받은 데이터 조회
      }

      async function onFacebook() {
        provider = new firebaseInstance.auth.FacebookAuthProvider();
        //데이터 받기 
        await authService.signInWithPopup(provider).then((result)=>{
          facebookData.displayName = result.user.displayName
          facebookData.profile = result.additionalUserInfo.profile.picture.data.url
          //dispatch(함수(facebookData))
        });
        // await 후 authService에서 받은 데이터 조회
      }

  return (
    <div className="sns_sign">
    <button className="sns-btn" name="google" onClick={onGoogle}>
      <img src="./img/google.svg" alt="" />
      <figcaption class="btn_title">구글로 시작하기</figcaption>
    </button>
    <button className="sns-btn" name="facebook" onClick={onFacebook}>
      <img src="./img/facebook.svg" alt="" />
      <figcaption className="btn_title">페이스북으로 시작하기</figcaption>
    </button>

  </div>
  )
}

export default SocialSign