import React, { useCallback, useEffect, useState } from "react";
import "../asset/upload.scss";
import TextareaAutosize from "react-textarea-autosize";
import { useSelector } from "react-redux";
import { serverTimestamp } from "firebase/firestore";
function Upload({ db, storageService, user, navigate, useInput }) {
  const [title, setTitle] = useInput("");
  const [textarea, setTextarea] = useInput("");
  const [fileData, setFileData] = useState("");
  const [preview, setPreview] = useState([]);
  const [pageId, setPageId] = useState("");
  const posts = useSelector((state) => state.posts);

  const time = new Date();

  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  const TitleHandler = useCallback(
    (e) => {
      setTitle(e);
    },
    [setTitle]
  );

  const textHandler = useCallback(
    (e) => {
      setTextarea(e);
    },
    [setTextarea]
  );

  function onFileChange(e) {
    const files = Array.from(e.target.files);
    let copyArray = [...fileData];
    copyArray.push(...files);
    setFileData(copyArray);
    let SaveArray = [];
    for (var i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = (e) => {
        SaveArray.push(e.target.result);
        let copyPreview = [...preview];
        copyPreview.push(...SaveArray);
        setPreview(copyPreview);
      };
    }
  }

  async function post(e) {
    e.preventDefault(e);
    let imageArray = [];
    if (title !== "" && textarea !== "") {
      if (preview.length !== 0) {
        for (var i = 0; i < preview.length; i++) {
          const fileRef = storageService
            .ref()
            .child(`${user.displayName}/${fileData[i].name}`);
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
        url: imageArray.length === 0 ? [] : imageArray,
        favorite: 0,
        pageId: pageId,
        profile: user.photoURL,
        timeStamp: serverTimestamp(),
        fileName:
          fileData.length === 0
            ? ""
            : fileData.map((value, index) => {
                return fileData[index].name;
              }),
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
    for (var i = 0; i < num; i++) {
      result += words.charAt(Math.floor(Math.random() * words.length));
    }
    return result;
  };

  function overlap(params) {
    const result = posts.some((item) => {
      return item.id === params;
    });
    return result;
  }

  useEffect(() => {
    let randomStr = generateRandomString(20);
    overlap(randomStr);
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
          onChange={(e) => TitleHandler(e)}
        />
        <div className="textarea">
          <TextareaAutosize
            cacheMeasurements
            // contentEditable="true"
            onHeightChange={(height) => {}}
            className="text"
            placeholder="당신의 이야기를 적어보세요."
            onChange={(e) => textHandler(e)}
          />
          <figure>
            {preview.length !== 0
              ? preview.map(function (url, i) {
                  return (
                    <img src={preview[i]} alt="" className="att" key={i} />
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
