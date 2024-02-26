import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "../asset/upload.scss";
import TextareaAutosize from "react-textarea-autosize";
import { serverTimestamp } from "firebase/firestore";
import { onFileChange, onfileData } from "../module/exportFunction";
import { db } from "../Firebase";
import { queryProps } from "../module/interfaceModule";
import { useNavigate } from "react-router-dom";

function Upload({ data, posts }: queryProps) {
  const [title, setTitle] = useState("");
  const [textarea, setTextarea] = useState("");
  const [pageId, setPageId] = useState("");
  const navigate = useNavigate();
  const time = new Date();

  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  const fileUrl: string[] = onfileData()[0];
  const files: File[] = onfileData()[1];

  async function post(e: FormEvent<Element>) {
    e.preventDefault();
    if (title !== "" && textarea !== "" && data) {
      //이미지 부분
      const content = {
        title: title,
        text: textarea,
        user: data.displayName,
        writer: data.uid,
        date: `${timeData.year}년 ${timeData.month}월 ${timeData.day}일`,
        url: fileUrl.length > 0 ? fileUrl : [],
        favorite: 0,
        pageId: pageId,
        profile: data.photoURL,
        timeStamp: serverTimestamp(),
        fileName: files.length > 0 ? files.map((value) => value.name) : "",
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

  const generateRandomString = (num: number) => {
    const words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (var i = 0; i < num; i++)
      result += words.charAt(Math.floor(Math.random() * words.length));
    return result;
  };

  function overlap(params: string) {
    if (posts) {
      return posts.some((item) => item.id === params);
    }
  }

  useEffect(() => {
    let randomStr: string = generateRandomString(20);
    if (overlap(randomStr)) {
      randomStr = generateRandomString(20);
      setPageId(randomStr);
    } else {
      setPageId(randomStr);
    }
  }, [posts]);

  return (
    <div className="upload">
      <form onSubmit={(e: FormEvent<Element>) => post(e)}>
        <input
          type="text"
          className="form-control titlearea"
          id="title"
          placeholder="제목을 입력하세요."
          maxLength={120}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        <div className="textarea">
          <TextareaAutosize
            cacheMeasurements
            // contentEditable="true"
            onHeightChange={(height) => {}}
            className="text"
            placeholder="당신의 이야기를 적어보세요."
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setTextarea(e.target.value)
            }
          />
          <figure>
            {fileUrl.length > 0
              ? fileUrl.map((url, index) => (
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
          onChange={(e: ChangeEvent) => onFileChange(e, "upload")}
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
