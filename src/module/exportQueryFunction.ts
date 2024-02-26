import { authService, db } from "../Firebase";

export function loadPost() {
  return new Promise((resolve, reject) => {
    const collectionRef = db.collection("post").orderBy("timeStamp", "asc");
    const unsubscribe = collectionRef.onSnapshot((snapshot: any) => {
      if (snapshot.docs.length > 0) {
        const postArray = snapshot.docs.map((doc: any) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
        resolve(postArray);
      } else {
        reject([]);
      }
    });
    return unsubscribe;
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = authService.onAuthStateChanged(async (user: any) => {
      if (user) resolve(user);
      else reject({});
      unsubscribe();
    });
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadNickName() {
  return new Promise((resolve, reject) => {
    const unsubscribe = db.collection("nickname").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() }));

      if (data.length > 0) resolve(data);
      else reject([]);
    });
    return unsubscribe;
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadDetail(pageId: string) {
  return new Promise((resolve, reject) => {
    const unsubscribe = db
      .collection("post")
      .doc(pageId)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();

        if (data) resolve(data);
        else reject({});
      });
    return unsubscribe;
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadReplys(pageId: string) {
  return new Promise((resolve, reject) => {
    const collectionRef = db.collection("post").doc(pageId).collection("reply");
    const unsubscribe = collectionRef.onSnapshot((snapshot: any) => {
      if (snapshot.docs.length > 0) {
        const postArray = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        resolve(postArray);
      } else {
        reject([]);
      }
    });
    return unsubscribe;
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}
