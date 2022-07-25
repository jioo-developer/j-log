import React, { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import UseInput from "./hook/UseInput";
function Reply({ db, URLID, user, ReplyGet }) {
  const [commentChange, setCommentChange] = useState(false);
  const [comment, setcomment] = UseInput([]);
  const [reply, setReply] = useState([]);

  useEffect(() => {
    db.collection("post")
      .doc(URLID)
      .collection("reply")
      .onSnapshot((replys) => {
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
      setcomment(e);
    },
    [comment]
  );

  function edit_reply() {
    setCommentChange(!commentChange);
  }
  function edit_end() {}
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
    };
    if (comment === "") {
      window.alert("댓글을 입력해주세요");
    } else {
      db.collection("post").doc(URLID).collection("reply").add(comment_content);
      window.alert("댓글을 달았습니다.");
      document.querySelector(".comment_input").value = "";
    }
  }

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
                {user.uid === com.uid ? (
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
                        onClick={(e) => reply_delete(e)}
                        data-id={com.id}
                      >
                        삭제
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              {commentChange === false ? (
                <p className={`reply_text`}>{com.comment}</p>
              ) : (
                <input
                  type="text"
                  className={`reply_input  form-control`}
                  placeholder={com.comment}
                  data-index={index}
                  onChange={onchageComment}
                />
              )}
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
    </>
  );
}

export default Reply;
