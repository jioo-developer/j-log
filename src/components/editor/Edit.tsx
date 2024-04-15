import { FormEvent, useEffect, useMemo } from "react";
import "../../asset/upload.scss";
import useLoadDetail from "../../query/loadDetail";
import { useMyContext } from "../../module/Mycontext";
import EditorComponent from "./EditorComponent";
import { useEditorContext } from "./EditorContext";
import { storageUpload } from "../../module/exportFunction";

const Edit = () => {
  const { location } = useMyContext();
  const {
    setTitle,
    setText,
    setImage,
    preview,
    file,
    title,
    text,
    firebaseUpload,
  } = useEditorContext();

  const URLID: string = useMemo(() => {
    return location.state.pageId ? location.state.pageId : location.state;
  }, [location]);

  const loadPage = useLoadDetail(URLID);

  const pageData = useMemo(() => {
    return loadPage.data;
  }, [loadPage]);

  useEffect(() => {
    if (pageData) {
      setTitle(pageData.title);
      setText(pageData.text);
      setImage(pageData.url);
    }
  }, []);

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

  async function post(e: FormEvent<Element>) {
    e.preventDefault();

    if (pageData && title !== "" && text !== "") {
      const resultState = {
        ...pageData,
        title: title,
        text: text,
        url: preview.length > 0 ? await imagePostHandler() : [],
      };
      firebaseUpload(resultState, "edit", pageData.pageId, pageData);
    } else {
      window.alert("제목과 내용을 다 입력하셨는지 확인해주세요");
    }
  }

  return (
    <>
      {pageData ? (
        <EditorComponent post={post} pageData={pageData} type={"edit"} />
      ) : null}
    </>
  );
};
export default Edit;
