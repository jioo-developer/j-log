import { authService, db } from "../Firebase";

export function loadPost() {
  return new Promise((resolve, reject) => {
    const collectionRef = db.collection("post").orderBy("timeStamp", "asc");
    collectionRef.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const postArray = snapshot.docs.map((doc) => {
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
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) resolve(user);
      else reject({});
      unsubscribe();
    });
  }).catch((error) => {
    const location = window.location.pathname;
    if (location !== "/sign" && location !== "/Auth") {
      window.location.href = "/sign";
    }
  });
}

export function loadNickName() {
  return new Promise((resolve, reject) => {
    db.collection("nickname")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({ ...doc.data() }));

        if (data.length > 0) resolve(data);
        else reject([]);
      });
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadDetail(pageId: string) {
  return new Promise((resolve, reject) => {
    db.collection("post")
      .doc(pageId)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();

        if (data) resolve(data);
        else reject({});
      });
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}

export function loadReplys(pageId: string) {
  return new Promise((resolve, reject) => {
    const collectionRef = db.collection("post").doc(pageId).collection("reply");
    collectionRef.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const postArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        resolve(postArray);
      } else {
        reject([]);
      }
    });
  }).catch((error) => {
    console.log(JSON.stringify(error));
  });
}
