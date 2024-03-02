import { FormEvent, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { serverTimestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { db } from "../Firebase";
import { LoadUserHookResult } from "../query/loadUser";
import { replyType } from "../module/interfaceModule";

type replyProps = {
  data: LoadUserHookResult | undefined;
  replyData: replyType[] | undefined;
  replyRefetch: any;
};

function Reply({ data, replyData, replyRefetch }: replyProps) {
  const location = useLocation();
  const URLID = location.state.pageId ? location.state.pageId : location.state;

  const [commentChange, setCommentChange] = useState(false);
  const [comment, setcomment] = useState("");
  const replyArea = useRef<HTMLTextAreaElement | null>(null);
  const [replyTarget, setTarget] = useState("");

  const time = new Date();
  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  function replyhandler(index: number, type?: string) {
    if (replyData) {
      if (!type) {
        setCommentChange(true);
        setcomment(replyData[index].comment);
        setTarget(replyData[index].id);
      } else {
        db.collection("post")
          .doc(URLID)
          .collection("reply")
          .doc(replyData[index].id)
          .update({ comment: comment })
          .then(() => {
            setCommentChange(false);
            replyRefetch();
          });
      }
    }
  }

  function reply_delete(index: number) {
    const ok = window.confirm("정말삭제하시겠습니까?");
    if (ok && replyData) {
      db.collection("post")
        .doc(URLID)
        .collection("reply")
        .doc(replyData[index].id)
        .delete()
        .then(() => replyRefetch());
    }
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
        timeStamp: serverTimestamp(),
      };
      if (comment === "") {
        window.alert("댓글을 입력해주세요");
      } else {
        db.collection("post")
          .doc(URLID)
          .collection("reply")
          .add(comment_content)
          .then(() => replyRefetch());
        if (replyArea.current) {
          replyArea.current.value = "";
        }
        window.alert("댓글을 달았습니다.");
      }
    }
  }

  return data ? (
    <>
      {replyData
        ? replyData.map(function (item, index) {
            return (
              <>
                <div className="reply_wrap" key={index}>
                  <div className="user_info">
                    <img src={item.profile} alt="" />
                    <div className="user_text">
                      <p className="reply_name">{item.replyrer}</p>
                      <p className="reply_date">{item.date}</p>
                    </div>
                    {data.uid === item.uid ||
                    data.uid === "MgoM64rubkOZMYOhNJjV8KFZxCV2" ? (
                      <div className="edit_comment">
                        <button
                          className="edit btns"
                          onClick={() => {
                            if (commentChange && replyTarget === item.id) {
                              replyhandler(index, "update");
                            } else {
                              replyhandler(index);
                            }
                          }}
                        >
                          {commentChange && replyTarget === item.id
                            ? "완료"
                            : "수정"}
                        </button>
                        <button
                          className="delete btns"
                          onClick={() => reply_delete(index)}
                        >
                          삭제
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {commentChange && replyTarget === item.id ? (
                    <input
                      type="text"
                      className={`reply_input  form-control`}
                      defaultValue={item.comment}
                      onChange={(e) => setcomment(e.target.value)}
                      data-id={item.id}
                    />
                  ) : (
                    <p className={`reply_text`}>{item.comment}</p>
                  )}
                </div>
              </>
            );
          })
        : null}

      <form onSubmit={(e: FormEvent) => commentUpload(e)} style={{ order: 0 }}>
        <TextareaAutosize
          cacheMeasurements
          onHeightChange={(height) => ""}
          minRows={4}
          className="comment_input"
          ref={replyArea}
          onChange={(e) => setcomment(e.target.value)}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  ) : null;
}

export default Reply;
