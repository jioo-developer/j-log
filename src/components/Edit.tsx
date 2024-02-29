import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../asset/upload.scss";
import { db, storageService } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import { onFileChange, storageUpload } from "../module/exportFunction";
function Edit() {
  const location = useLocation();
  const navigate = useNavigate();

  const URLID = location.state.pageId ? location.state.pageId : location.state;

  const loadPage = useLoadDetail(URLID);
  const pageData = loadPage.data;

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [preview, setImage] = useState<any[]>([]);
  const [file, setFile] = useState<any[]>([]);

  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title);
      setText(pageData.text);
      setImage(pageData.url);
    }
  }, []);

  async function post(e: FormEvent<Element>) {
    e.preventDefault();
    if (pageData) {
      const resultState = {
        ...pageData,
        title: title,
        text: text,
        url: preview.length > 0 ? await imagePostHandler() : [],
      };
      // console.log(resultState);
      db.collection("post")
        .doc(pageData.pageId)
        .update(resultState)
        .then(() => {
          const storageRef = storageService.ref();
          if (pageData.fileName) {
            pageData.fileName.forEach((value) => {
              const imagesRef = storageRef.child(`${pageData.writer}/${value}`);
              imagesRef.delete();
            });
          }

          window.alert("수정이 완료 되었습니다.");
          const redirect = `/detail?id=${pageData.pageId}`;
          navigate(redirect, { state: pageData.pageId });
        });
    }
  }

  async function imagePostHandler() {
    if (pageData) {
      const arr = [...preview];
      const filterArr = arr.filter((item) =>
        item.includes("data:image/png;base64")
      );
      // preview에 이전 데이터 url 과 신규 데이터 url이 섞여 있는 걸 filter
      // 그러면 신규 url만 filterArr에 남음

      const paramsArr = filterArr.length === 0 ? pageData.url : filterArr;
      // 필터의 길이가 일때 pageData 유지 || 필터 배열을 할당
      const imageResult: any[] = (await storageUpload(paramsArr, file)) || [];
      // 그러면 필터 배열의 새 url이 나옴

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes("data:image/png;base64")) {
          arr.splice(i, 1, imageResult[i]);
        }
      }
      return arr;
    } else {
      return [];
    }
  }

  async function filechangeHandler(e: ChangeEvent) {
    const changeResult = await onFileChange(e);
    if (Array.isArray(changeResult)) {
      const copyArray = [...preview];
      copyArray.push(...changeResult[0]);
      setImage(copyArray); //preview
      setFile(changeResult[1]); //new file
    }
  }

  function previewDelete(value: number) {
    const filter1 = preview.filter((item, index) => index !== value);
    const filter2 = file.filter((item, index) => index !== value);
    setImage(filter1);
    setFile(filter2);
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
                {preview.length > 0
                  ? preview.map((url, index) => (
                      <div key={index}>
                        <button
                          type="button"
                          className="preview_delete"
                          onClick={() => {
                            previewDelete(index);
                          }}
                        >
                          <img src="./img/close.png" />
                        </button>
                        <img src={url} alt="" className="att" key={index} />
                      </div>
                    ))
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
