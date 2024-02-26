import React, { ChangeEvent, useEffect, useState } from "react";
import "../asset/profile.scss";
import { authService, db, firebaseInstance } from "../Firebase";
import "../asset/header.scss";
import { LoadUserHookResult } from "../query/loadUser";
import useLoadNickName from "../query/loadNickName";
import firebase from "firebase/compat/app";
import { onFileChange } from "../module/exportFunction";
import { useNavigate } from "react-router-dom";

function Profile({ data }: { data: LoadUserHookResult | undefined }) {
  const [NameEdit, setNameEdit] = useState(false);
  const [title, setTitle] = useState("");
  const loadNick = useLoadNickName();
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setTitle(data.displayName);
    }
  }, [data]);

  async function deleteUser() {
    if (data) {
      let password;
      const branch = window.confirm("소셜로그인을 사용하시나요?");
      if (branch) {
        password = window.prompt("2차 비밀번호를 입력해주세요.");
      } else {
        password = window.prompt("비밀번호를 입력해주세요.");
      }
      db.collection("delete").doc(`${data.uid}`).set({ 상태: "탈퇴" });
      db.collection("nickname").doc(data.displayName).delete();
      const userDelete = authService.currentUser;

      if (userDelete && password) {
        const credential =
          await firebaseInstance.auth.EmailAuthProvider.credential(
            data.email,
            password
          );
        userDelete
          .reauthenticateWithCredential(credential)
          .then(() => {
            userDelete.delete().then(() => {
              window.alert("회원탈퇴 되었습니다.");
              authService.signOut();
              navigate("/");
            });
          })
          .catch(() => {
            window.alert("암호가 잘못되었거나 사용자에게 암호가 없습니다.");
          });
      }
    }
  }

  //프로필 이미지 변경 함수

  async function NickNameChange() {
    const overlapFilter = (loadNick?.data || []).some(
      (item) => item.nickname === title
    );
    if (overlapFilter) {
      window.alert("이미 사용중인 닉네임 입니다.");
    } else {
      const user = data ? data : (firebase.auth().currentUser as firebase.User);
      if (user && user.displayName) {
        db.collection("nickname").doc(user.displayName).delete();
        db.collection("nickname").doc(title).set({ nickname: title });
        await user.updateProfile({ displayName: title });
        window.alert("닉네임이 변경되었습니다");
      }
    }
  }

  function nickToggleFunc() {
    setNameEdit((prev) => !prev);
  }

  return data ? (
    <div className="profile_wrap">
      <section className="content">
        <div className="profile_area">
          <div className="img_wrap">
            <input
              type="file"
              accept="image/*"
              id="img_check"
              onChange={(e: ChangeEvent) => onFileChange(e, "profile")}
            />
            <figure className="profileImg">
              <img src={data.photoURL} width="130px" height="135px" alt="" />
            </figure>
            <label htmlFor="img_check" className="uploads btn">
              이미지 업로드
            </label>
          </div>
          <div className="name_area">
            {!NameEdit ? (
              <>
                <b className="nickname">{data.displayName}</b>
                <button className="btn comment_btn" onClick={nickToggleFunc}>
                  닉네임 수정
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={title}
                  className="form-control"
                  onChange={(e) => setTitle(e.target.value)}
                />

                <button className="btn comment_btn" onClick={NickNameChange}>
                  수정완료
                </button>
              </>
            )}
          </div>
        </div>
        <div className="suggest">
          <p className="suggest_title">문의사항</p>
          <p className="director_email">rlawlgh388@naver.com</p>
        </div>
        <div className="withdrawal">
          <div className="delete_wrap">
            <p className="withdrawal_title">회원 탈퇴</p>
            <button className="btn" onClick={deleteUser}>
              회원 탈퇴
            </button>
          </div>
          <p className="explan">
            탈퇴 시 작성한 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
          </p>
        </div>
      </section>
    </div>
  ) : null;
}

export default Profile;
