import React, { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useEditorContext } from "./EditorContext";
import { FirebaseData } from "../../module/interfaceModule";
import { useMyContext } from "../../module/Mycontext";

type propsType = {
  post: (e: FormEvent<Element>) => void;
  pageData?: FirebaseData;
  type: string;
  refetch?: any;
};

const EditorComponent = ({ post, pageData, type, refetch }: propsType) => {
  const {
    setTitle,
    setText,
    preview,
    title,
    text,
    previewDelete,
    changeHanlder,
  } = useEditorContext();
  const { navigate } = useMyContext();
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
                      onClick={() => previewDelete(index)}
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
          onChange={(e: ChangeEvent) => changeHanlder(e, type, refetch)}
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
            <div className="exit" onClick={() => navigate("/")}>
              ← &nbsp;나가기
            </div>
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
