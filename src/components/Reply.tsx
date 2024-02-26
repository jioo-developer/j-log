import { FormEvent, useCallback, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../Firebase";
import { LoadUserHookResult } from "../query/loadUser";
import useReply from "../query/loadReply";

function Reply({ data }: { data: LoadUserHookResult | undefined }) {
  const location = useLocation();
  let URLID = location.state.pageId;
  const reply = useReply(URLID);
  const replyData = reply.data;
  const [commentChange, setCommentChange] = useState(false);
  const [comment, setcomment] = useState("");
  const replyArea = useRef<HTMLTextAreaElement | null>(null);
  const time = new Date();
  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  function edit_reply(index: number) {
    setCommentChange(true);
    setCommentChange(false);
    db.collection("post")
      .doc(URLID)
      .collection("reply")
      .doc("")
      .update({ comment: comment });
  }

  function reply_delete(index: number) {
    const ok = window.confirm("정말삭제하시겠습니까?");
    if (ok)
      db.collection("post").doc(URLID).collection("reply").doc("").delete();
  }
  function commentUpload(e: FormEvent) {
    e.preventDefault();
    if (data && replyArea) {
      const comment_content = {
        replyrer: data.displayName,
        comment: comment,
        date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
        profile: data.photoURL,
        uid: data.uid,
        boolean: false,
        timeStamp: serverTimestamp(),
      };
      if (comment === "") {
        window.alert("댓글을 입력해주세요");
      } else {
        db.collection("post")
          .doc(URLID)
          .collection("reply")
          .add(comment_content);
        if (replyArea.current) {
          replyArea.current.value = "";
        }
        window.alert("댓글을 달았습니다.");
      }
    }
  }

  return replyData && data ? (
    <>
      {replyData.map(function (item, index) {
        return (
          <>
            <div className="reply_wrap">
              <div className="user_info">
                <img src={item.profile} alt="" />
                <div className="user_text">
                  <p className="reply_name">{item.replyrer}</p>
                  <p className="reply_date">{item.date}</p>
                </div>
                {data.uid === item.uid ||
                data.uid === "cylx7plFnrccO8Qv7wYXEAd1meG2" ? (
                  <div className="edit_comment">
                    <button
                      className="edit btns"
                      onClick={() => edit_reply(index)}
                    >
                      수정
                    </button>
                    <button
                      className="delete btns"
                      onClick={() => reply_delete(index)}
                      data-id={item.id}
                    >
                      삭제
                    </button>
                  </div>
                ) : null}
              </div>
              {!commentChange && !item.boolean ? (
                <p className={`reply_text`}>{item.comment}</p>
              ) : commentChange && item.boolean ? (
                <input
                  type="text"
                  className={`reply_input  form-control`}
                  placeholder={item.comment}
                  value={comment}
                />
              ) : (
                <p className={`reply_text`}>{item.comment}</p>
              )}
            </div>
          </>
        );
      })}
      <form onSubmit={(e: FormEvent) => commentUpload(e)} style={{ order: 0 }}>
        <TextareaAutosize
          cacheMeasurements
          onHeightChange={(height) => ""}
          minRows={4}
          className="comment_input"
          ref={replyArea}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  ) : null;
}

export default Reply;
