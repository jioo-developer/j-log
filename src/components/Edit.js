import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation, Link } from "react-router-dom";
import "../asset/upload.scss";
function Edit({ user, navigate, db, storageService }) {
  const location = useLocation();
  const correction = location.state.pageData;
  const [pageInfor, setpageInfor] = useState(correction);
  const [fileData, setFileData] = useState("");
  const [title, setTitle] = "";
  const [text, setText] = useState("");
  const [prevImage, setPrevImage] = useState([]);

  function onFileChange(e) {
    setPrevImage(pageInfor.url);
    const files = Array.from(e.target.files);
    if (files.length !== 0) {
      setFileData(files);
      let SaveArray = [];
      for (var i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          SaveArray.push(e.target.result);
          let copyState = { ...pageInfor };
          copyState.url = SaveArray;
          setpageInfor(copyState);
        };
      }
    }
  }

  async function post(e) {
    e.preventDefault(e);
    //이미지 부분

    await db
      .doc(correction.pageId)
      .update(pageInfor)
      .then(() => {
        let imagesRef = storageService.ref();
        window.alert("수정이 완료 되었습니다.");
        const redirect = `/detail?id=${correction.pageId}`;
        navigate(redirect, { state: correction.pageId });
      });
  }

  return (
    <div className="upload">
      <form onSubmit={post}>
        <input
          type="text"
          className="form-control titlearea"
          id="title"
          value={pageInfor.title}
          maxLength={120}
        />
        <div className="textarea">
          <TextareaAutosize
            cacheMeasurements
            onHeightChange={(height) => {}}
            className="text"
            value={pageInfor.text}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-form"
          id="image"
          onChange={onFileChange}
        />
        <label htmlFor="image" className="Attachment image-att">
          이미지를 담아주세요
        </label>
        <p className="warnning">
          ※ 이미지를 한번에 업로드 해주세요. (하나씩 업로드하면 오류납니다)
        </p>
        <div className="bottom_wrap">
          <Link
            to={`/detail?id=${correction.pageId}`}
            state={{ pageId: correction.pageId }}
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
  );
}

export default Edit;
