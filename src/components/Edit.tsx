import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation, Link } from "react-router-dom";
import { useMyContext } from "../module/MyContext";
import "../asset/upload.scss";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import { LoadUserHookResult } from "../query/loadUser";
import { onFileChange } from "../module/exportFunction";
function Edit() {
  const { navigate } = useMyContext();
  const location = useLocation();
  const URLID = location.state.pageId;
  const loadPage = useLoadDetail(URLID);
  const pageData = loadPage.data;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title);
      setText(pageData.text);
    }
  }, [pageData]);

  function post(e: FormEvent<Element>) {
    e.preventDefault();
    const resultState = { ...pageData };
    resultState.title = title;
    resultState.text = text;
    if (pageData) {
      db.collection("post")
        .doc(pageData.pageId)
        .update(resultState)
        .then(() => {
          const storageRef = storageService.ref();
          pageData.fileName.forEach((value) => {
            const imagesRef = storageRef.child(`${pageData.user}/${value}`);
            imagesRef.delete();
          });
          window.alert("수정이 완료 되었습니다.");
          const redirect = `/detail?id=${pageData.pageId}`;
          navigate(redirect, { state: pageData.pageId });
        });
    }
  }

  return (
    <>
      {pageData ? (
        <div className="upload">
          <form onSubmit={(e: FormEvent<Element>) => post(e)}>
            <input
              type="text"
              className="form-control titlearea"
              id="title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.value}
              maxLength={120}
            />
            <div className="textarea">
              <TextareaAutosize
                onHeightChange={(height) => {}}
                className="text"
                value={text}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setText(e.target.value)
                }
              />
              <figure>
                {pageData.url.map((value, index) => {
                  return (
                    <img src={value} alt="" className="att" key={index}></img>
                  );
                })}
              </figure>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="file-form"
              id="image"
              onChange={(e: ChangeEvent) => onFileChange(e, "edit")}
            />
            <label htmlFor="image" className="Attachment image-att">
              이미지를 담아주세요
            </label>
            <p className="warnning">
              ※ 이미지를 한번에 업로드 해주세요. (하나씩 업로드하면 오류납니다)
            </p>
            <div className="bottom_wrap">
              <Link
                to={`/detail?id=${pageData.pageId}`}
                state={{ pageId: pageData.pageId }}
              >
                <div className="exit">← &nbsp;나가기</div>
              </Link>
              <div className="cancel_wrap">
                <button type="submit" className="post">
                  글작성
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default Edit;
