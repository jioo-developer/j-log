import { FormEvent, useCallback, useEffect, useState } from "react";
import "../../asset/upload.scss";
import { useMyContext } from "../../module/Mycontext";
import EditorComponent from "./EditorComponent";
import { storageUpload } from "../../module/exportFunction";
import { useEditorContext } from "./EditorContext";
import { serverTimestamp } from "firebase/firestore";

function Upload() {
  const { data, posts, refetch } = useMyContext();
  const [pageId, setPageId] = useState("");

  const { preview, file, title, text, firebaseUpload } = useEditorContext();

  useEffect(() => {
    let randomStr: string = generateRandomString(20);
    if (overlapCallback(randomStr)) {
      randomStr = generateRandomString(20);
      setPageId(randomStr);
    } else {
      setPageId(randomStr);
    }
  }, []);

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

  async function post(e: FormEvent<Element>) {
    e.preventDefault();
    const timeData = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
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
      firebaseUpload(content, "upload", pageId);
    } else {
      window.alert("제목과 내용을 다 입력하셨는지 확인해주세요");
    }
  }

  return <EditorComponent post={post} type={"upload"} refetch={refetch} />;
}

export default Upload;
