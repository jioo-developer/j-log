import { FormEvent, useCallback, useEffect, useState } from "react";
import "../asset/upload.scss";
import { serverTimestamp } from "firebase/firestore";
import { storageUpload } from "../../module/exportFunction";
import { db } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../module/Mycontext";
import EditorComponent from "./EditorComponent";

function Upload() {
  const { data, posts, postRefetch } = useMyContext();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [pageId, setPageId] = useState("");
  const [preview, setImage] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const navigate = useNavigate();
  const time = new Date();

  const timeData = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
  };

  async function post(e: FormEvent<Element>) {
    e.preventDefault();
    if (data && title !== "" && text !== "") {
      const content = {
        title: title,
        text: text,
        user: data.displayName,
        writer: data.uid,
        date: `${timeData.year}년 ${timeData.month}월 ${timeData.day}일`,
        url: preview.length > 0 ? await storageUpload(preview, file) : [],
        favorite: 0,
        pageId: pageId,
        profile: data.photoURL,
        timeStamp: serverTimestamp(),
        fileName: file.length > 0 ? file.map((value: File) => value.name) : "",
      };
      firebaseUplaod(content);
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

  const overlapCallback = useCallback(
    (params: string) => {
      if (posts && posts.length > 0) {
        return posts.some((item) => item.id === params);
      } else {
        return false;
      }
    },
    [posts]
  );

  useEffect(() => {
    let randomStr: string = generateRandomString(20);
    if (overlapCallback(randomStr)) {
      randomStr = generateRandomString(20);
      setPageId(randomStr);
    } else {
      setPageId(randomStr);
    }
  }, []);

  return (
    <EditorComponent
      title={title}
      setTitle={setTitle}
      text={text}
      setText={setText}
      preview={preview}
      setImage={setImage}
      file={file}
      setFile={setFile}
    />
  );
}

export default Upload;
