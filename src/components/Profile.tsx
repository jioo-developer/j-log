import React, { ChangeEvent, useEffect, useState } from "react";
import "../asset/profile.scss";
import { authService, db, firebaseInstance, storageService } from "../Firebase";
import "../asset/header.scss";
import useLoadNickName from "../query/loadNickName";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { useMyContext } from "../module/Mycontext";
import { useEditorContext } from "./editor/EditorContext";

function Profile() {
  const [NameEdit, setNameEdit] = useState(false);
  const [title, setTitle] = useState("");
  const loadNick = useLoadNickName();
  const navigate = useNavigate();
  const { data, refetch } = useMyContext();
  const { changeHanlder } = useEditorContext();
  useEffect(() => {
    if (data) {
      setTitle(data.displayName);
    }
  }, [data]);

  async function deleteUser() {
    if (data) {
      const password = window.prompt("비밀번호를 입력해주세요.");
      const check = await db.collection("nickname").doc(`${data.uid}-G`).get();
      const socialPW = check.data();

      if (password) {
        if (socialPW) {
          //socialPw 이 있으면
          if (password === socialPW.password) {
            deleteHandler(password, "sosial");
          } else {
            window.alert("첫 가입시 입력하신 비밀번호랑 다릅니다.");
          }
        } else {
          //socialPw 이 없으면
          deleteHandler(password, "origin");
        }
      }
    }
  }

  async function deleteHandler(password: string, type: string) {
    const userDelete = authService.currentUser;
    if (data && userDelete) {
      if (type === "origin") {
        const credential =
          await firebaseInstance.auth.EmailAuthProvider.credential(
            data.email,
            password
          );
        // 회원탈퇴 credential
        if (credential) {
          userDelete
            .reauthenticateWithCredential(credential)
            .then(() => {
              userDelete.delete().then(() => dbDelete(userDelete, type));
            })
            .catch((error) => {
              window.alert("암호가 잘못되었습니다.");
            });
        } else {
          window.alert("회원 탈퇴가 완료되지 않았습니다. 문의하십시오.");
        }
        // type social ↓
      } else {
        const googleProvider = new GoogleAuthProvider();
        reauthenticateWithPopup(userDelete, googleProvider)
          .then(() => {
            userDelete.delete().then(() => dbDelete(userDelete, type));
          })
          .catch(() => window.alert("회원 정보가 없습니다."));
      }
      // type social ↑
    }
  }

  async function dbDelete(user: firebase.User, type: string) {
    const ref = storageService.ref();
    const imageRef = ref.child(`${user.uid}`);

    const deletePromises = [
      db
        .collection("delete")
        .doc(`${data?.uid}`)
        .set({ 상태: "탈퇴", nickname: user.displayName }),
      db.collection("nickname").doc(`${user.displayName}`).delete(),
      imageRef.delete(),
    ];

    if (type === "social") {
      deletePromises.push(
        db.collection("nickname").doc(`${data?.uid}-G`).delete()
      );
    }
    return Promise.all(deletePromises).then(() => {
      window.alert("회원탈퇴 되었습니다.");
      navigate("/sign");
    });
  }

  async function NickNameChange() {
    if (loadNick.data && loadNick.data.length > 0 && data) {
      const overlapFilter = loadNick.data.some(
        (item) => item.nickname === title
      );
      if (overlapFilter && title !== data.displayName) {
        window.alert("이미 사용중인 닉네임 입니다.");
      } else {
        const user = authService.currentUser;
        if (user && user.displayName) {
          db.collection("nickname").doc(user.displayName).delete();
          db.collection("nickname").doc(title).set({ nickname: title });
          await user.updateProfile({ displayName: title });
          refetch();
          setNameEdit(false);
        }
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
              onChange={(e: ChangeEvent) => {
                changeHanlder(e, "profile", refetch);
              }}
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
          <p
            className="explan"
            style={{ borderBottom: "1px solid #eee", paddingBottom: 15 }}
          >
            탈퇴 시 작성한 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
          </p>
          <p className="explan">
            소셜로그인 회원탈퇴는 첫 가입 시 입력했던 비밀번호 입니다.
          </p>
        </div>
      </section>
    </div>
  ) : null;
}

export default Profile;
