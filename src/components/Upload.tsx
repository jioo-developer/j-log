import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "../asset/upload.scss";
import TextareaAutosize from "react-textarea-autosize";
import { serverTimestamp } from "firebase/firestore";
import { onFileChange, storageUpload } from "../module/exportFunction";
import { db } from "../Firebase";
import { queryProps } from "../module/interfaceModule";
import { useNavigate } from "react-router-dom";

function Upload({ data, posts }: queryProps) {
  const [title, setTitle] = useState("");
  const [textarea, setTextarea] = useState("");
  const [pageId, setPageId] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [files, setFile] = useState<any[]>([]);
  const navigate = useNavigate();
  const time = new Date();

  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  async function filechangeHandler(e: ChangeEvent) {
    const changeResult = await onFileChange(e);
    if (Array.isArray(changeResult)) {
      setPreview(changeResult[0]);
      setFile(changeResult[1]);
    }
  }

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
        url:
          preview.length > 0
            ? await storageUpload(preview, files, "upload")
            : [],
        favorite: 0,
        pageId: pageId,
        profile: data.photoURL,
        timeStamp: serverTimestamp(),
        fileName:
          files.length > 0 ? files.map((value: File) => value.name) : "",
      };
      await db
        .collection("post")
        .doc(pageId)
        .set(content)
        .then(() => {
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
  }, []);

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
            onHeightChange={(height) => {}}
            className="text"
            placeholder="당신의 이야기를 적어보세요."
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setTextarea(e.target.value)
            }
          />
          <figure>
            {preview.length > 0
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
          onChange={(e: ChangeEvent) => filechangeHandler(e)}
        />
        <label htmlFor="image" className="Attachment image-att">
          이미지를 담아주세요
        </label>
        <div className="bottom_wrap">
          <button className="exit" onClick={() => navigate("/")}>
            ← &nbsp;나가기
          </button>
          <button type="submit" className="post">
            글작성
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
