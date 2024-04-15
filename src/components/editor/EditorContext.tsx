import {
  ChangeEvent,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { onFileChange, storageUpload } from "../../module/exportFunction";
import { db } from "../../Firebase";
import { FirebaseData, postProps } from "../../module/interfaceModule";
import { useMyContext } from "../../module/Mycontext";

type EditorContextProps = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  preview: string[];
  setImage: React.Dispatch<React.SetStateAction<string[]>>;
  file: File[];
  setFile: React.Dispatch<React.SetStateAction<File[]>>;
  changeHanlder: (e: ChangeEvent, type: string, refetch: any) => void;
  previewDelete: (value: number) => void;
  firebaseUpload: (
    data: any,
    type: string,
    pageId: string,
    pageData?: FirebaseData
  ) => void;
};

const EditorContext = createContext<EditorContextProps>({
  title: "",
  setTitle: () => {},
  text: "",
  setText: () => {},
  preview: [],
  setImage: () => {},
  file: [],
  setFile: () => {},
  changeHanlder: () => {},
  previewDelete: () => {},
  firebaseUpload: () => {},
});

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [preview, setImage] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);

  const { refetch, navigate } = useMyContext();

  function previewDelete(value: number) {
    const filter1 = preview.filter((item, index) => index !== value);
    const filter2 = file.filter((item, index) => index !== value);
    setImage(filter1);
    setFile(filter2);
  }

  const changeHanlder = async (e: ChangeEvent, type: string, refetch?: any) => {
    const changeResult: any = await onFileChange(e);
    if (Array.isArray(changeResult)) {
      if (type === "profile") {
        storageUpload(
          changeResult[0] as string[],
          changeResult[1] as File[],
          "profile"
        ).then(() => refetch());
        //프로필 이미지 변경을 담당하는 외부 함수
      } else if (type === "upload") {
        setImage(changeResult[0] as string[]);
      } else if (type === "edit") {
        const copyArray = [...preview];
        copyArray.push(...(changeResult[0] as string[]));
        setImage(copyArray); //preview
      }
      setFile(changeResult[1] as File[]); //new file
    }
  };

  async function firebaseUpload(
    data: postProps,
    type: string,
    pageId: string,
    pageData?: FirebaseData
  ) {
    if (type === "upload") {
      await db
        .collection("post")
        .doc(pageId)
        .set(data)
        .then(() => {
          const redirect = `/detail?id=${pageId}`;
          refetch();
          navigate(redirect, { state: pageId });
        });
    } else {
      await db
        .collection("post")
        .doc(pageId)
        .update(data)
        .then(() => {
          window.alert("수정이 완료 되었습니다.");
          if (pageData) {
            const redirect = `/detail?id=${pageData.pageId}`;
            navigate(redirect, { state: pageData.pageId });
          }
        });
    }
  }

  return (
    <EditorContext.Provider
      value={{
        title,
        setTitle,
        text,
        setText,
        preview,
        setImage,
        file,
        setFile,
        changeHanlder,
        previewDelete,
        firebaseUpload,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  return useContext(EditorContext);
};
