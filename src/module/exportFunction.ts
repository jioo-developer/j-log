import { authService, db, storageService } from "../Firebase";

export async function loadPost() {
  return new Promise((resolve, reject) => {
    const collectionRef = db.collection("post").orderBy("timeStamp", "asc");
    collectionRef.onSnapshot((snapshot: any) => {
      if (snapshot.docs.length) {
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
  });
}

export async function loadUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = authService.onAuthStateChanged(async (user: any) => {
      if (user) {
        resolve(user);
      } else {
        reject({});
      }
      unsubscribe();
    });
  });
}
