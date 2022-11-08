import React, { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { serverTimestamp } from "firebase/firestore";
function Reply({ db, URLID, user, ReplyGet }) {
  const [commentChange, setCommentChange] = useState(false);
  const [comment, setcomment] = useState([]);
  const [reply, setReply] = useState([]);
  const [loadComment, setLoadComment] = useState("");
  useEffect(() => {
    const collectionRef = db
      .collection("post")
      .doc(URLID)
      .collection("reply")
      .orderBy("timeStamp", "asc");

    collectionRef.onSnapshot((replys) => {
      const replyArray = replys.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setReply(replyArray);
    });
  }, []);

  useEffect(() => {
    ReplyPost();
  }, [reply]);

  function ReplyPost() {
    ReplyGet(reply);
  }

  const time = new Date();
  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  const onchageComment = useCallback(
    (e) => {
      setcomment(e.target.value);
    },
    [comment]
  );

  function edit_reply(e) {
    setCommentChange(true);
    const btn = e.target.getAttribute("data-id");
    const replys = Array.from(document.querySelectorAll(".reply_text"));
    replys.map((item, index) => {
      var indexData = item.getAttribute("data-id");
      if (btn === indexData) {
        let copyState = [...reply];
        copyState[index].boolean = true;
        setReply(copyState);
        setLoadComment(copyState[index].comment);
      }
    });
  }

  function edit_Post(e) {
    setCommentChange(false);
    const target = e.target.getAttribute("data-id");
    db.collection("post")
      .doc(URLID)
      .collection("reply")
      .doc(target)
      .update({ comment: loadComment });
  }

  function reply_delete(e) {
    const target = e.target.getAttribute("data-id");
    const ok = window.confirm("정말삭제하시겠습니까?");
    if (ok) {
      db.collection("post").doc(URLID).collection("reply").doc(target).delete();
    }
  }
  function commentUpload(e) {
    e.preventDefault();
    const comment_content = {
      replyrer: user.displayName,
      comment: comment,
      date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
      profile: user.photoURL,
      uid: user.uid,
      boolean: false,
      timeStamp: serverTimestamp(),
    };
    if (comment === "") {
      window.alert("댓글을 입력해주세요");
    } else {
      db.collection("post").doc(URLID).collection("reply").add(comment_content);
      window.alert("댓글을 달았습니다.");
      document.querySelector(".comment_input").value = "";
    }
  }

  const newComment = useCallback(
    (e) => {
      setLoadComment(e.target.value);
    },
    [loadComment]
  );

  return (
    <>
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
                {user.uid === com.uid ||
                user.uid === "Lon5eQWCvHP8ZbwYZ4KHQYanV442" ? (
                  <>
                    <div className="edit_comment">
                      {commentChange === false && com.boolean === false ? (
                        <div
                          className="edit btns"
                          data-index={index}
                          data-id={com.id}
                          onClick={(e) => edit_reply(e)}
                        >
                          수정
                        </div>
                      ) : commentChange === true && com.boolean === true ? (
                        <div
                          className="edit btns"
                          data-index={index}
                          data-id={com.id}
                          onClick={(e) => edit_Post(e)}
                        >
                          완료
                        </div>
                      ) : (
                        <div
                          className="edit btns"
                          data-index={index}
                          onClick={(e) => edit_reply(e)}
                          data-id={com.id}
                        >
                          수정
                        </div>
                      )}
                      <div
                        className="delete btns"
                        onClick={(e) => reply_delete(e)}
                        data-id={com.id}
                      >
                        삭제
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              {commentChange === false && com.boolean === false ? (
                <p className={`reply_text`} data-id={com.id}>
                  {com.comment}
                </p>
              ) : commentChange === true && com.boolean === true ? (
                <input
                  type="text"
                  className={`reply_input  form-control`}
                  placeholder={com.comment}
                  data-index={index}
                  value={loadComment}
                  onChange={(e) => newComment(e)}
                />
              ) : (
                <p className={`reply_text`} data-id={com.id}>
                  {com.comment}
                </p>
              )}
            </div>
          </>
        );
      })}
      <form onSubmit={commentUpload} style={{ order: 0 }}>
        <TextareaAutosize
          cacheMeasurements
          onHeightChange={(height) => ""}
          minRows={4}
          className="comment_input"
          onChange={onchageComment}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  );
}

export default Reply;
