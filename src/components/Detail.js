import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import "../asset/detail.scss";
import { useLocation } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import UseInput from "./hook/UseInput";
function Detail({ user, navigate, dispatch, db, storageService }) {
  const location = useLocation();
  let URLID = location.state.pageId;
  const [pageData, setPageData] = useState([]);
  const [favoriteBtn, setFavoriteBtn] = useState(false);
  const [reply, setReply] = useState([]);
  const [comment, setcomment] = UseInput("");
  const [fileNamed, setFileNamed] = useState();
  const [commentChange, setCommentChange] = useState(false);
  const [newComment, setNewComment] = UseInput("");
  const [imgLazy, setImageLazy] = useState(false);
  let clientWidths;
  let naturalWidths;
  const time = new Date();

  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  useEffect(() => {
    if (URLID === undefined) {
      URLID = location.state;
    }
    db.collection("post")
      .doc(URLID)
      .onSnapshot((snapshot) => {
        let postArray = { ...snapshot.data() };
        setPageData(postArray);
      });
    let cookieCheck = document.cookie;
    if (cookieCheck === "Cookie=done") {
      setFavoriteBtn(true);
    } else {
      setFavoriteBtn(false);
    }
    //본문

    //리플
    db.collection("post")
      .doc(URLID)
      .collection("reply")
      .onSnapshot((replys) => {
        let replyArray = replys.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setReply(replyArray);
      });
  }, []);

  function setCookie(name, value, expiredays) {
    time.setDate(time.getDate() + expiredays);
    document.cookie = `${name} = ${escape(
      value
    )}; expires =${time.toUTCString()};`;
  }

  function onDelete(e) {
    e.preventDefault();
    const ok = window.confirm("정말 삭제 하시겠습니까?");
    let locate = db.collection("post").doc(URLID);
    let storageRef = storageService.ref();
    if (ok) {
      if (fileNamed !== "") {
        fileNamed.map(function (a, i) {
          let imagesRef = storageRef.child(`${pageData.user}/${fileNamed[i]}`);
          imagesRef.delete();
        });
      }
      reply.map(function (a, i) {
        locate.collection("reply").doc(reply[i].id).delete();
      });
      locate.delete();
    }
  }

  function favoriteHandler(e) {
    if (e.target.checked) {
      db.collection("post")
        .doc(URLID)
        .update({
          favorite: pageData.favorite + 1,
        })
        .then(() => {
          setCookie("Cookie", "done", 1);
          setFavoriteBtn(true);
        });
    }
  }

  const onchageComment = useCallback(
    (e) => {
      setcomment(e);
    },
    [comment]
  );

  const newComHandler = useCallback((e) => {
    setNewComment(e);
  });

  useEffect(() => {
    if (pageData.length !== 0) {
      setFileNamed(pageData.fileName);
    }
  }, [pageData]);

  function edit_reply() {}
  function edit_end() {}
  function reply_delete() {}
  function commentUpload() {}

  return (
    <div className="detail_wrap">
      <Header user={user} />
      <div className="in_wrap">
        <section className="sub_header">
          <h1>{pageData.title}</h1>
          <div className="writer_wrap">
            <div className="left_wrap">
              <img src={pageData.profile} alt="" className="profile" />
              <p className="writer">{pageData.user}</p>
              <p className="date">{pageData.date}</p>
            </div>
            {user.uid === pageData.writer ||
            user.uid === "Lon5eQWCvHP8ZbwYZ4KHQYanV442" ? (
              <>
                <div className="right_wrap">
                  <button className="edit">수정</button>
                  <button className="delete" onClick={onDelete}>
                    삭제
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section className="content_wrap">
          <pre className="text">{pageData.text}</pre>
          <div className="grid"></div>
          <div className="comment">
            <div className="favorite_wrap">
              <p className="com_title">게시글에 대한 댓글을 달아주세요.</p>
              <input
                type="checkbox"
                id="favorite_check"
                onClick={(e) => {
                  favoriteHandler(e);
                }}
              />
              {favoriteBtn !== true ? (
                <>
                  <label htmlFor="favorite_check" className="favorite_btn">
                    <span>👍</span>추천&nbsp;{pageData.favorite}
                  </label>
                </>
              ) : (
                <div className="favorite_btn">
                  <span>👍</span>추천&nbsp;{pageData.favorite}
                </div>
              )}
            </div>
            {reply.map(function (com, index) {
              return (
                <>
                  <div className="reply_wrap">
                    <div className="user_info">
                      <img src={com.profile} alt="" />
                      <div className="user_text">
                        <p className="reply_name">{com.replyrer}</p>
                        <p className="reply_date">{com.date}</p>
                      </div>
                      {user.uid === com.uids ? (
                        <>
                          <div className="edit_comment">
                            {commentChange === false ? (
                              <>
                                <div
                                  className="edit btns"
                                  data-index={index}
                                  onClick={edit_reply}
                                >
                                  수정
                                </div>
                              </>
                            ) : (
                              <div
                                className="edit btns"
                                data-index={index}
                                onClick={edit_end}
                              >
                                완료
                              </div>
                            )}
                            <div
                              className="delete btns"
                              data-index={index}
                              onClick={reply_delete}
                            >
                              삭제
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <p
                      className={`reply_text reply_text${index}`}
                      data-id={com.id}
                      data-index={index}
                    >
                      {com.comment}
                    </p>
                    <input
                      type="text"
                      className={`reply_input reply_input${index} form-control`}
                      placeholder={com.comment}
                      data-index={index}
                      data-id={com.id}
                      onChange={newComHandler}
                    />
                  </div>
                </>
              );
            })}
            <form onSubmit={commentUpload}>
              <TextareaAutosize
                cacheMeasurements
                onHeightChange={(height) => ""}
                minRows={4}
                className="comment_input"
                onChange={onchageComment}
              />
              <button className="btn">댓글 작성</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Detail;
