import React, { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation, Link } from "react-router-dom";
import "../asset/upload.scss";
function Edit({ user, navigate, db, storageService }) {
  const location = useLocation();
  const correction = location.state.pageData;
  const [pageInfor, setpageInfor] = useState(correction);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prevImage, setPrevImage] = useState([]);

  useEffect(() => {
    setPrevImage(pageInfor.fileName);
    setTitle(pageInfor.title);
    setText(pageInfor.text);
  }, []);

  function onFileChange(e) {
    const files = Array.from(e.target.files);
    let saveArray = [];
    for (var i = 0; i < files.length; i++) {
      const reader = new FileReader();
      let fileRef = storageService
        .ref()
        .child(`${pageInfor.user}/${files[i].name}`);
      reader.readAsDataURL(files[i]);
      reader.onload = (e) => {
        saveArray.push(e.target.result);
        connectHandler(saveArray, fileRef, files);
      };
    }
  }

  async function connectHandler(SaveArray, fileRef, files) {
    let newArray = [];
    let nameArray = [];
    for (let [index, value] of SaveArray.entries()) {
      const response = await fileRef.putString(value, "data_url");
      newArray.push(await response.ref.getDownloadURL());
      nameArray.push(files[index].name);
      let copyState = { ...pageInfor };
      copyState.url = newArray;
      copyState.fileName = nameArray;
      setpageInfor(copyState);
    }
  }

  const onchangeTitle = useCallback(
    (e) => {
      setTitle(e.target.value);
    },
    [title]
  );

  const onchangeText = useCallback(
    (e) => {
      setText(e.target.value);
    },
    [text]
  );

  async function post(e) {
    e.preventDefault(e);
    let resultState = { ...pageInfor };
    resultState.title = title;
    resultState.text = text;
    await db
      .collection("post")
      .doc(correction.pageId)
      .update(resultState)
      .then(() => {
        const storageRef = storageService.ref();
        if (prevImage.length !== 0) {
          prevImage.forEach((value) => {
            const imagesRef = storageRef.child(`${pageInfor.user}/${value}`);
            imagesRef.delete();
          });
        }
        window.alert("????????? ?????? ???????????????.");
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
          value={title}
          maxLength={120}
          onChange={onchangeTitle}
        />
        <div className="textarea">
          <TextareaAutosize
            onHeightChange={(height) => {}}
            className="text"
            value={text}
            onChange={onchangeText}
          />
          <figure>
            {pageInfor.url.map((value, index) => {
              return <img src={value} alt="" className="att" key={index}></img>;
            })}
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
          ???????????? ???????????????
        </label>
        <p className="warnning">
          ??? ???????????? ????????? ????????? ????????????. (????????? ??????????????? ???????????????)
        </p>
        <div className="bottom_wrap">
          <Link
            to={`/detail?id=${correction.pageId}`}
            state={{ pageId: correction.pageId }}
          >
            <div className="exit">??? &nbsp;?????????</div>
          </Link>
          <div className="cancel_wrap">
            <button type="submit" className="post">
              ?????????
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Edit;
