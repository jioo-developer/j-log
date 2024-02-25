import { ChangeEvent } from "react";
import { storageService } from "../Firebase";
import firebase from "firebase/compat/app";

export async function onFileChange(
  e: ChangeEvent,
  type: string,
  setState?: any
) {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement.files) {
    const theFiles = Array.from(inputElement.files);
    if (theFiles.length > 0) {
      const reader = new FileReader();
      const resultData: Promise<any>[] = await Promise.all(
        // promise를 묶어서 resultData로 return 해줌
        theFiles.map(async (item) => {
          // files에 map을 써서 return 되는 걸 새로운 배열로 만들어줌
          return await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(item);
          });
        })
      );
      if (setState) setState(resultData);
      onfileData(resultData, theFiles);
      storageUpload(resultData, theFiles, type);
    }
  }
}

export function onfileData(imageurl?: any, fileData?: File[]) {
  return [imageurl, fileData];
}

async function storageUpload(imageurl: any, fileData: File[], type: string) {
  let fileRef: firebase.storage.Reference;
  const user = firebase.auth().currentUser as firebase.User;
  if (imageurl.length > 0) {
    return await Promise.all(
      fileData.map(async (item, index) => {
        if (type === "profile") {
          fileRef = storageService.ref().child(`${type}/${item.name}`);
        } else if (type === "upload") {
          fileRef = storageService.ref().child(`${user.uid}/${item.name}`);
        } else if (type === "edit") {
          fileRef = storageService.ref().child(`${type}/${item.name}`);
        }
        if (type === "profile") {
          const response = await fileRef.putString(imageurl[index], "data_url");
          const profileUrl = await response.ref.getDownloadURL();
          await user.updateProfile({ photoURL: profileUrl });
          window.alert("프로필이미지가 변경 되었습니다.");
        } else {
          const response = await fileRef.putString(imageurl, "data_url");
          return await response.ref.getDownloadURL();
        }
      })
    );
  }
}
