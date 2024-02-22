import React, { useEffect, useState } from "react";
import "../asset/upload.scss";
import TextareaAutosize from "react-textarea-autosize";
import { useSelector } from "react-redux";
import { serverTimestamp } from "firebase/firestore";
function Upload({ db, storageService, user, navigate, useState }) {
  const [title, setTitle] = useState("");
  const [textarea, setTextarea] = useState("");
  const [fileData, setFileData] = useState("");
  const [preview, setPreview] = useState([]);
  const [pageId, setPageId] = useState("");
  const posts = [];

  const time = new Date();

  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  function onFileChange(e) {
    const files = Array.from(e.target.files);
    const copyArray = [...fileData];
    copyArray.push(...files);
    setFileData(copyArray);
    const SaveArray = [];
    for (var i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onloadend = (e) => {
        SaveArray.push(e.target.result);
        const copyPreview = [...preview];
        copyPreview.push(...SaveArray);
        setPreview(copyPreview);
      };
    }
  }

  async function post(e) {
    e.preventDefault(e);
    const imageArray = [];
    if (title !== "" && textarea !== "") {
      if (preview.length) {
        for (var i = 0; i < preview.length; i++) {
          const fileRef = storageService
            .ref()
            .child(`${user.uid}/${fileData[i].name}`);
          const response = await fileRef.putString(preview[i], "data_url");
          const result = await response.ref.getDownloadURL();
          imageArray.push(result);
        }
      }
      //이미지 부분
      const content = {
        title: title,
        text: textarea,
        user: user.displayName,
        writer: user.uid,
        date: `${timeData.year}년 ${timeData.month}월 ${timeData.day}일`,
        url: imageArray.length ? imageArray : [],
        favorite: 0,
        pageId: pageId,
        profile: user.photoURL,
        timeStamp: serverTimestamp(),
        fileName: fileData.length ? fileData.map((value) => value.name) : "",
      };

      await db
        .collection("post")
        .doc(pageId)
        .set(content)
        .then(() => {
          window.alert("포스트가 업로드 되었습니다.");
          const redirect = `/detail?id=${pageId}`;
          navigate(redirect, { state: pageId });
        });
    } else {
      window.alert("제목과 내용을 다 입력하셨는지 확인해주세요");
    }
  }

  const generateRandomString = (num) => {
    const words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (var i = 0; i < num; i++)
      result += words.charAt(Math.floor(Math.random() * words.length));
    return result;
  };

  function overlap(params) {
    return posts.some((item) => item.id === params);
  }

  useEffect(() => {
    let randomStr = generateRandomString(20);
    if (overlap(randomStr)) {
      randomStr = generateRandomString(20);
      setPageId(randomStr);
    } else {
      setPageId(randomStr);
    }
  }, []);

  return (
    <div className="upload">
      <form onSubmit={post}>
        <input
          type="text"
          className="form-control titlearea"
          id="title"
          placeholder="제목을 입력하세요."
          maxLength={120}
          onChange={(e) => setTitle(e)}
        />
        <div className="textarea">
          <TextareaAutosize
            cacheMeasurements
            // contentEditable="true"
            onHeightChange={(height) => {}}
            className="text"
            placeholder="당신의 이야기를 적어보세요."
            onChange={(e) => setTextarea(e)}
          />
          <figure>
            {preview.length
              ? preview.map((url, index) => (
                  <img src={url} alt="" className="att" key={index} />
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
          onChange={onFileChange}
        />
        <label htmlFor="image" className="Attachment image-att">
          이미지를 담아주세요
        </label>
        <div className="bottom_wrap">
          <div className="exit" onClick={() => navigate("/")}>
            ← &nbsp;나가기
          </div>
          <button type="submit" className="post">
            글작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
