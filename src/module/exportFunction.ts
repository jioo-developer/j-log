import { ChangeEvent } from "react";
import { storageService } from "../Firebase";
import firebase from "firebase/compat/app";

export async function onFileChange(e: ChangeEvent) {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement.files) {
    const theFiles = Array.from(inputElement.files);
    if (theFiles.length > 0) {
      const result = await Promise.all(
        theFiles.map((item: File) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(item);
            reader.onloadend = (e) => {
              if (e.target) {
                const dataURL = e.target.result as string;
                resolve(dataURL);
              } else {
                reject("");
              }
            };
          });
        })
      );
      return [result, theFiles];
    }
  }
}

type changeHanlderTypes = {
  e: ChangeEvent;
  type: string;
  setFile: React.Dispatch<React.SetStateAction<File[]>>;
  preview: any[];
  setImage: React.Dispatch<React.SetStateAction<any[]>>;
  refresh?: any;
};
export async function changeHanlder({
  e,
  type,
  setFile,
  preview,
  setImage,
  refresh,
}: changeHanlderTypes) {
  const changeResult: any = await onFileChange(e);
  if (Array.isArray(changeResult)) {
    if (type === "profile") {
      storageUpload(
        changeResult[0] as string[],
        changeResult[1] as File[],
        "profile"
      ).then(() => refresh());
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
}

export async function storageUpload(
  imageurl: any,
  fileData: File[],
  type?: string
) {
  const user = firebase.auth().currentUser as firebase.User;
  if (imageurl.length > 0) {
    return await Promise.all(
      fileData.map(async (item, index) => {
        const fileRef: firebase.storage.Reference = storageService
          .ref()
          .child(`${user.uid}/${item.name}`);
        if (type === "profile") {
          const response = await fileRef.putString(imageurl[index], "data_url");
          const profileUrl = await response.ref.getDownloadURL();
          await user.updateProfile({ photoURL: profileUrl });
        } else {
          const response = await fileRef.putString(imageurl[index], "data_url");
          return await response.ref.getDownloadURL();
        }
      })
    );
  } else {
    return [];
  }
}

export function setCookie(name: string, value: string) {
  const time = new Date();
  const result = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    23,
    59,
    59
  );
  result.setMilliseconds(999);
  result.setHours(result.getHours() + 9);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${result.toUTCString()};`;
}
