import React, { useEffect, useState } from "react";
import "../asset/upload.scss";
import { db, storageService } from "../Firebase";
import { connect } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
function Edit({ user, navigate }) {
  let [posts, setPosts] = useState([]);
  let [title, setTitle] = useState("");
  let [textarea, setTextarea] = useState("");
  let locationEdit = "";
  // props.reducer[0];
  let [preview, setPreview] = useState([]);
  let [filename, setFileName] = useState([]);
  let [fileNamed, setFileNamed] = useState([]);
  let [saveImage, setSaveImage] = useState([]);
  let [keep, setKeep] = useState(false);
  let array = [];
  let attchmentUrl = [];

  useEffect(() => {
    db.collection("post")
      .doc(`${locationEdit}`)
      .onSnapshot((snapshot) => {
        let postArray = { ...snapshot.data() };
        setPosts(postArray);
      });
  }, []);

  useEffect(() => {
    setTitle(posts.title);
    setTextarea(posts.text);
    setFileNamed(posts.fileName);

    let copySaveImage = [...saveImage];
    if (posts.url !== undefined) {
      copySaveImage.push(...posts.url);
    }
    setSaveImage(copySaveImage);
  }, [posts]);

  function onFileChange(e) {
    setKeep(true);
    let files = Array.from(e.target.files);
    setFileName(files);
    for (var i = 0; i < files.length; i++) {
      const reader = new FileReader();
      if (files) {
        reader.readAsDataURL(files[i]);
      }

      reader.onload = async (e) => {
        array.push(e.target.result);
        let copyPreview = [...preview];
        await copyPreview.push(...array);
        setPreview(copyPreview);
      };
    }
  }

  async function post(e) {
    e.preventDefault();
    if (preview.length !== 0) {
      for (var i = 0; i < preview.length; i++) {
        const fileRef = storageService
          .ref()
          .child(`${user.displayName}/${filename[i].name}`);
        const response = await fileRef.putString(preview[i], "data_url");
        attchmentUrl.push(await response.ref.getDownloadURL());
      }
    }

    const content = {
      title: title,
      text: textarea,
      url: keep === false ? saveImage : attchmentUrl,
      fileName:
        keep === false
          ? fileNamed
          : filename.map(function (a, i) {
              return filename[i].name;
            }),
    };

    await db
      .doc(`post/${locationEdit}`)
      .update(content)
      .then(() => {
        if (keep === false) {
          window.alert("수정이 완료되었습니다.");
          navigate(`/detail?id=${locationEdit}`);
        } else {
          let storageRef = storageService.ref();
          fileNamed.map(function (a, i) {
            let imagesRef = storageRef.child(`${posts.user}/${fileNamed[i]}`);
            imagesRef.delete();
          });
          window.alert("수정이 완료되었습니다.");
          navigate(`/detail?id=${locationEdit}`);
        }
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="textarea">
          <TextareaAutosize
            cacheMeasurements
            onHeightChange={(height) => console.log(height)}
            className="text"
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
          />
          <figure>
            {keep === false ? (
              <>
                {saveImage.map(function (url, i) {
                  return <img src={url} alt="" className="att" key={i}></img>;
                })}
              </>
            ) : (
              <>
                {preview.map(function (url, i) {
                  return <img src={url} alt="" className="att" key={i}></img>;
                })}
              </>
            )}
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
        <p className="warnning">※ 이미지를 한번에 업로드 해주세요. (하나씩x)</p>
        <div className="bottom_wrap">
          <div
            className="exit"
            onClick={() => {
              navigate(`/detail?id=${locationEdit}`);
            }}
          >
            ← &nbsp;나가기
          </div>
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

function location공장(state) {
  return {
    reducer: state.reducer,
  };
}

export default connect(location공장)(Edit);
