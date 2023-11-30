import React, { useEffect, useState } from "react";
import "../asset/profile.scss";
import { firebaseInstance } from "../Firebase";
import "../asset/header.scss";

function Profile({ user, navigate, db, authService, storageService }) {
  const userDelete = authService.currentUser;
  const [NameEdit, setNameEdit] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => setTitle(user.displayName), []);

  async function deleteUser() {
    const password = window.prompt("비밀번호를 입력해주세요");
    db.collection("delete").doc(`${user.displayName}`).set({ 상태: "탈퇴" });
    const credential = await firebaseInstance.auth.EmailAuthProvider.credential(
      user.email,
      password
    );
    userDelete.reauthenticateWithCredential(credential).then(() => {
      userDelete.delete().then(() => {
        const storageRef = storageService.ref();
        const imagesRef = storageRef.child(`${title}/`);
        imagesRef.delete();
        window.alert("회원탈퇴 되었습니다.");
        authService.signOut();
        navigate("/");
        window.location.reload();
      });
    });
  }

  //프로필 이미지 변경 함수

  function onFileChange(e) {
    const theFile = e.target.files[0];
    const reader = new FileReader();
    if (theFile) reader.readAsDataURL(theFile);
    reader.onloadend = (e) => ImgUpload(e.target.result, theFile);
  }

  async function ImgUpload(imageurl, uploadfile) {
    const fileRef = storageService
      .ref()
      .child(`${title}-profile/${uploadfile.name}`);
    const response = await fileRef.putString(imageurl, "data_url");
    const profileUrl = await response.ref.getDownloadURL();

    await user.updateProfile({ photoURL: profileUrl }).then(() => {
      window.alert("프로필 변경이 완료되었습니다.");
      navigate("/profile");
    });
  }

  async function NickNameChange() {
    if (!NameEdit) {
      setNameEdit((prev) => !prev);
    } else {
      await user.updateProfile({ displayName: title }).then(() => {
        setNameEdit((prev) => !prev);
        window.alert("닉네임이 변경되었습니다");
      });
    }
  }

  return (
    <div className="profile_wrap">
      <section className="content">
        <div className="profile_area">
          <div className="img_wrap">
            <input
              type="file"
              accept="image/*"
              id="img_check"
              onChange={onFileChange}
            />
            <figure className="profileImg">
              <img src={user.photoURL} width="130px" height="135px" alt="" />
            </figure>
            <label htmlFor="img_check" className="uploads btn">
              이미지 업로드
            </label>
          </div>
          <div className="name_area">
            {NameEdit ? (
              <input
                type="text"
                value={title}
                className="form-control"
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <b className="nickname">{user.displayName}</b>
            )}
            <button className="btn comment_btn" onClick={NickNameChange}>
              {NameEdit ? "수정완료" : "닉네임 수정"}
            </button>
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
  );
}

export default Profile;
