import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useLocation, Link } from "react-router-dom";
import { useMyContext } from "../module/MyContext";
import "../asset/upload.scss";
import { db, storageService } from "../Firebase";
function Edit() {
  const location = useLocation();
  const correction = location.state.pageData;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prevImage, setPrevImage] = useState([]);
  const { navigate } = useMyContext();

  useEffect(() => {
    setPrevImage(correction.fileName);
    setTitle(correction.title);
    setText(correction.text);
  }, []);

  async function post(e: FormEvent<Element>) {
    e.preventDefault();
    let resultState = { ...correction };
    resultState.title = title;
    resultState.text = text;
    await db
      .collection("post")
      .doc(correction.pageId)
      .update(resultState)
      .then(() => {
        const storageRef = storageService.ref();
        if (prevImage.length > 0) {
          prevImage.forEach((value) => {
            const imagesRef = storageRef.child(`${correction.user}/${value}`);
            imagesRef.delete();
          });
        }
        window.alert("수정이 완료 되었습니다.");
        const redirect = `/detail?id=${correction.pageId}`;
        navigate(redirect, { state: correction.pageId });
      });
  }

  return (
    <div className="upload">
      <form onSubmit={(e: FormEvent<Element>) => post(e)}>
        <input
          type="text"
          className="form-control titlearea"
          id="title"
          value={title}
          maxLength={120}
        />
        <div className="textarea">
          <TextareaAutosize
            onHeightChange={(height) => {}}
            className="text"
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
          />
          <figure>
            {correction.map((value, index) => {
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
