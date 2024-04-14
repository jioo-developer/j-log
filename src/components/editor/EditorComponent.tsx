import React, { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import ReactTextareaAutosize from "react-textarea-autosize";
import { FirebaseData } from "../../module/interfaceModule";
import { changeHanlder } from "../../module/exportFunction";

type propsType = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  preview: any[];
  setImage: React.Dispatch<React.SetStateAction<any[]>>;
  file: File[];
  setFile: React.Dispatch<React.SetStateAction<File[]>>;
  pageData?: FirebaseData | undefined;
  refresh?: any;
};

const EditorComponent = ({
  title,
  setTitle,
  text,
  setText,
  preview,
  setImage,
  file,
  setFile,
  pageData,
  refresh,
}: propsType) => {
  function previewDelete(value: number) {
    const filter1 = preview.filter((item, index) => index !== value);
    const filter2 = file.filter((item, index) => index !== value);
    setImage(filter1);
    setFile(filter2);
  }

  async function firebaseUplaod() {
    if (type === "upload") {
      await db
        .collection("post")
        .doc(pageId)
        .set(content)
        .then(() => {
          const redirect = `/detail?id=${pageId}`;
          postRefetch();
          navigate(redirect, { state: pageId });
        });
    } else {
      await db
        .collection("post")
        .doc(pageData.pageId)
        .update(resultState)
        .then(() => {
          window.alert("수정이 완료 되었습니다.");
          const redirect = `/detail?id=${pageData.pageId}`;
          navigate(redirect, { state: pageData.pageId });
        });
    }
  }
  return (
    <div className="upload">
      <form onSubmit={(e: FormEvent<Element>) => post(e)}>
        <input
          type="text"
          className="form-control titlearea"
          id="title"
          autoFocus={false}
          autoComplete="off"
          defaultValue={title}
          maxLength={120}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        <div className="textarea">
          <ReactTextareaAutosize
            cacheMeasurements
            onHeightChange={(height) => {}}
            className="text"
            autoComplete="off"
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
          onChange={(e: ChangeEvent) => {
            changeHanlder(e, type, setFile, preview, setImage, refresh);
          }}
        />
        <label htmlFor="image" className="Attachment image-att">
          이미지를 담아주세요
        </label>

        <div className="bottom_wrap">
          {pageData ? (
            <Link
              to={`/detail?id=${pageData.pageId}`}
              state={{ pageId: pageData.pageId }}
            >
              <div className="exit">← &nbsp;나가기</div>
            </Link>
          ) : (
            <div className="exit">← &nbsp;나가기</div>
          )}
          <div className="cancel_wrap">
            <button type="submit" className="post">
              글작성
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditorComponent;
