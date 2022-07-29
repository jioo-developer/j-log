import React, { useEffect, useState } from "react";
import "../asset/profile.scss";
import { firebaseInstance } from "../Firebase";
import Header from "./Header";
import "../asset/header.scss";

function Profile({ user, navigate, db, authService, storageService }) {
  const userDelete = authService.currentUser;
  const [NameEdit, setNameEdit] = useState(false);
  const [uploadCheck, setUploadCheck] = useState(false);
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const commonObject = {};
  console.log(user.displayName);

  useEffect(() => {
    setTitle(user.displayName);
  }, []);

  function deleteUser() {
    let pw = window.prompt("비밀번호를 입력해주세요");
    let password = pw;
    db.collection("delete").doc(`${user.displayName}`).set({ 상태: "탈퇴" });
    const credential = firebaseInstance.auth.EmailAuthProvider.credential(
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
      });
    });
  }

  function onFileChange(e) {
    const theFile = e.target.files[0];
    setUploadCheck(!uploadCheck);
    const reader = new FileReader();
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
    return new Promise(function (res) {
      reader.onloadend = (e) => {
        let copyObject = { ...commonObject };
        copyObject.image = e.target.result;
        copyObject.file = theFile;
        res(copyObject);
      };
    })
      .then((result) => {
        setFile(result.image);
        return result;
      })
      .then((result) => {
        ImgUpload(result);
      });
  }

  async function ImgUpload(parmas) {
    const fileRef = storageService
      .ref()
      .child(`${title}-profile/${parmas.file.name}`);
    const response = await fileRef.putString(parmas.image, "data_url");
    const profileUrl = await response.ref.getDownloadURL();

    await user.updateProfile({ photoURL: profileUrl }).then(() => {
      setUploadCheck(!uploadCheck);
      window.alert("프로필 변경이 완료되었습니다.");
      navigate("/profile");
    });
  }

  async function NickNameChange() {
    if (NameEdit === false) {
      setNameEdit(!NameEdit);
    } else {
      await user.updateProfile({ displayName: title }).then(() => {
        setNameEdit(!NameEdit);
        window.alert("닉네임이 변경되었습니다");
      });
    }
  }

  return (
    <div className="profile_wrap">
      <Header user={user} />
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
              {uploadCheck ? (
                <img src={file} width="130px" height="135px" alt="" />
              ) : (
                <img src={user.photoURL} width="130px" height="135px" alt="" />
              )}
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
            {NameEdit ? (
              <button className="btn comment_btn" onClick={NickNameChange}>
                수정완료
              </button>
            ) : (
              <button className="btn comment_btn" onClick={NickNameChange}>
                닉네임 수정
              </button>
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
  );
}

export default Profile;
