import { FormEvent, useEffect, useMemo, useState } from "react";
import "../asset/upload.scss";
import { db } from "../../Firebase";
import useLoadDetail from "../../query/loadDetail";
import { storageUpload } from "../../module/exportFunction";
import { useMyContext } from "../../module/Mycontext";
import EditorComponent from "./EditorComponent";

function Edit() {
  const { navigate, location } = useMyContext();

  const URLID: string = useMemo(() => {
    return location.state.pageId ? location.state.pageId : location.state;
  }, [location]);

  const loadPage = useLoadDetail(URLID);

  const pageData = useMemo(() => {
    return loadPage.data;
  }, [loadPage]);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [preview, setImage] = useState<any[]>([]);
  const [file, setFile] = useState<File[]>([]);

  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title);
      setText(pageData.text);
      setImage(pageData.url);
    }
  }, []);

  async function post(e: FormEvent<Element>) {
    e.preventDefault();

    if (pageData && title !== "" && text !== "") {
      const resultState = {
        ...pageData,
        title: title,
        text: text,
        url: preview.length > 0 ? await imagePostHandler() : [],
      };
      firebaseUplaod(resultState);
    } else {
      window.alert("제목과 내용을 다 입력하셨는지 확인해주세요");
    }
  }

  async function imagePostHandler() {
    if (pageData) {
      const arr = [...preview];
      const matchArr = arr.filter((item) => {
        return item.match(/data:image\/(png|jpg|jpeg|gif|bmp);base64/);
      });
      // 새 이미지 배열
      if (matchArr.length > 0) {
        const imageResult = await storageUpload(matchArr, file);
        const typeFilter =
          imageResult.length > 0
            ? imageResult.filter((item) => item !== undefined)
            : [];
        const urlArr = arr.filter((item) => item.includes("firebase"));
        const result = [...urlArr, ...typeFilter];
        return result;
      } else {
        return arr;
      }
    }
  }

  return (
    <>
      {pageData ? (
        <EditorComponent
          title={title}
          setTitle={setTitle}
          text={text}
          setText={setText}
          preview={preview}
          setImage={setImage}
          file={file}
          setFile={setFile}
          pageData={pageData}
        />
      ) : null}
    </>
  );
}

export default Edit;
