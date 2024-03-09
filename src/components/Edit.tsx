import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Link } from "react-router-dom";
import "../asset/upload.scss";
import { db } from "../Firebase";
import useLoadDetail from "../query/loadDetail";
import { onFileChange, storageUpload } from "../module/exportFunction";
import { useMyContext } from "../module/Mycontext";

function Edit() {
  const { navigate, location } = useMyContext();

  const URLID: string = useMemo(() => {
    return location.state.pageId ? location.state.pageId : location.state;
  }, [location]);

  const loadPage = useLoadDetail(URLID);

  const pageData = useMemo(() => {
    return loadPage.data;
  }, [loadPage]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [preview, setImage] = useState<any[]>([]);
  const [file, setFile] = useState<File[]>([]);

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
      db.collection("post")
        .doc(pageData.pageId)
        .update(resultState)
        .then(() => {
          window.alert("수정이 완료 되었습니다.");
          const redirect = `/detail?id=${pageData.pageId}`;
          navigate(redirect, { state: pageData.pageId });
        });
    }
  }

  async function filechangeHandler(e: ChangeEvent) {
    const changeResult = await onFileChange(e);

    if (Array.isArray(changeResult)) {
      const copyArray = [...preview];
      copyArray.push(...(changeResult[0] as string[]));
      setImage(copyArray); //preview
      setFile(changeResult[1] as File[]); //new file
    }
  }

  function previewDelete(value: number) {
    const filter1 = preview.filter((item, index) => index !== value);
    const filter2 = file.filter((item, index) => index !== value);
    setImage(filter1);
    setFile(filter2);
  }

  async function imagePostHandler() {
    if (pageData) {
      const arr = [...preview];
      const matchArr = arr.filter((item) => {
        return item.match(/data:image\/(png|jpg|jpeg|gif|bmp);base64/);
      });
      // 새 이미지 배열
      if (matchArr.length > 0) {
        const imageResult = await storageUpload(matchArr, file);
        const typeFilter =
          imageResult.length > 0
            ? imageResult.filter((item) => item !== undefined)
            : [];
        const urlArr = arr.filter((item) => item.includes("firebase"));
        const result = [...urlArr, ...typeFilter];
        return result;
      } else {
        return arr;
      }
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
              autoFocus={false}
              autoComplete="off"
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
                autoComplete="off"
                defaultValue={text}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setText(e.target.value)
                }
              />
              <figure>
                {preview && preview.length > 0
                  ? preview.map((url, index) => (
                      <div key={index}>
                        <button
                          type="button"
                          className="preview_delete"
                          onClick={() => {
                            previewDelete(index);
                          }}
                        >
                          <img src="./img/close.png" alt="" />
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
                {/* <button type="button" onClick={imagePostHandler}>
                  임시
                </button> */}
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default Edit;
