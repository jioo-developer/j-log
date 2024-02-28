import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../asset/upload.scss";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import { onFileChange, storageUpload } from "../module/exportFunction";
function Edit() {
  const location = useLocation();
  const URLID = location.state.pageId ? location.state.pageId : location.state;
  const loadPage = useLoadDetail(URLID);
  const pageData = loadPage.data;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prevImage, setImage] = useState<any[]>([]);
  const [newImage, setNew] = useState<any[]>([]);
  const [file, setFile] = useState<any[]>([]);
  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title);
      setText(pageData.text);
      setImage(pageData.url);
    }
  }, [pageData]);

  async function post(e: FormEvent<Element>) {
    e.preventDefault();
    if (pageData) {
      const resultState = {
        ...pageData,
        title: title,
        text: text,
        url:
          prevImage.length > 0
            ? [...pageData.url, await storageUpload(newImage, file, "edit")]
            : [],
      };
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

  async function filechangeHandler(e: ChangeEvent) {
    const changeResult = await onFileChange(e);
    if (Array.isArray(changeResult)) {
      const copyArray = [...prevImage];
      copyArray.push(...changeResult[0]);
      setImage(copyArray);
      setNew(changeResult[0]);
      setFile(changeResult[1]);
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
              defaultValue={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              maxLength={120}
            />
            <div className="textarea">
              <TextareaAutosize
                onHeightChange={(height) => {}}
                className="text"
                defaultValue={text}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setText(e.target.value)
                }
              />
              <figure>
                {prevImage.length > 0
                  ? prevImage.map((value, index) => {
                      return (
                        <img src={value} alt="" className="att" key={index} />
                      );
                    })
                  : null}
              </figure>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="file-form"
              id="image"
              onChange={(e: ChangeEvent) => filechangeHandler(e)}
            />
            <label htmlFor="image" className="Attachment image-att">
              이미지를 담아주세요
            </label>

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
