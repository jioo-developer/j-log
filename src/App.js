import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import { authService, db, storageService } from "./Firebase";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import useInput from "./hook/UseInput";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PostLoad } from "./index";
import Header from "./components/Header";
function App() {
  const [userObj, setUserObj] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = window.location.pathname;

  useEffect(() => {
    if (!userObj) {
      authService.onAuthStateChanged(async (user) => {
        if (user) await setUserObj(user);
      });
    }
  }, []);

  useEffect(() => {
    if (userObj) {
      const collectionRef = db.collection("post").orderBy("timeStamp", "asc");
      collectionRef.onSnapshot((snapshot) => {
        if (snapshot.docs.length) {
          const postArray = snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          });
          dispatch(PostLoad(postArray));
        } else {
          console.log("DB내 데이터가 없습니다.");
          console.log("------------------------");
        }
      });
    }
  }, [userObj]);

  function logoutHanlder(value) {
    setUserObj(value);
  }

  return (
    <div className="App">
      {location === "/" || location === "/profile" || location === "/detail" ? (
        <Header
          user={userObj}
          logoutHanlder={logoutHanlder}
          dispatch={dispatch}
        />
      ) : null}
      <Routes>
        <Route path="/" element={<Home user={userObj} navigate={navigate} />} />
        <Route
          path="/detail"
          element={
            <Detail
              user={userObj}
              navigate={navigate}
              dispatch={dispatch}
              db={db}
              storageService={storageService}
              useInput={useInput}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              user={userObj}
              navigate={navigate}
              db={db}
              authService={authService}
              storageService={storageService}
            />
          }
        />
        <Route
          path="/upload"
          element={
            <Upload
              user={userObj}
              navigate={navigate}
              db={db}
              storageService={storageService}
              useInput={useInput}
            />
          }
        />
        <Route
          path="/edit"
          element={
            <Edit
              user={userObj}
              navigate={navigate}
              db={db}
              storageService={storageService}
            />
          }
        />
        <Route
          path="/sign"
          element={
            <Sign
              authService={authService}
              useInput={useInput}
              user={userObj}
              dispatch={dispatch}
              navigate={navigate}
            />
          }
        />
        <Route
          path="/Auth"
          element={
            <Auth
              navigate={navigate}
              authService={authService}
              db={db}
              useInput={useInput}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
