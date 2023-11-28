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
function App() {
  const [init, setInit] = useState(false);
  const [Login, setLogin] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLogin(true);
        setUserObj(user);
      } else {
        setLogin((prev) => prev);
      }
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (Login) {
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
  }, []);

  function LoginHalper(value) {
    setLogin(value);
  }

  return (
    <div className="App">
      <Routes>
        {init ? (
          Login ? (
            <>
              <Route
                path="/"
                element={<Home user={userObj} LoginHalper={LoginHalper} />}
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
            </>
          ) : (
            <>
              <Route
                path="/"
                element={<Sign authService={authService} useInput={useInput} />}
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
            </>
          )
        ) : null}
      </Routes>
    </div>
  );
}

export default App;
