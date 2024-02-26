import { useNavigate } from "react-router-dom";
import { authService, db, firebaseInstance } from "../Firebase";

function SocialSign() {
  const navigate = useNavigate();
  async function onGoogle() {
    const provider = await new firebaseInstance.auth.GoogleAuthProvider();
    //데이터 받기
    const result = await authService.signInWithPopup(provider);

    if (result.user && result.user.displayName) {
      db.collection("nickname")
        .doc(result.user.displayName)
        .set({ nickname: result.user.displayName })
        .then(() => navigate("/"));
    }

    // await 후 authService에서 받은 데이터 조회
  }

  async function onFacebook() {
    const provider = await new firebaseInstance.auth.FacebookAuthProvider();
    //데이터 받기
    await authService.signInWithPopup(provider).then((result) => {
      console.log("현재 페이스북 로그인은 인증만료 처리중입니다.");
      // if (result.user && result.user.displayName) {
      //   db.collection("nickname")
      //     .doc(result.user.displayName)
      //     .set({ nickname: result.user.displayName })
      //     .then(() => navigate("/"));
      // }
    });
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
