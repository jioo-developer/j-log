import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import Header from "./components/Header";
import useLoadUser, { LoadUserHookResult } from "./query/loadUser";
import { useMyContext } from "./module/MyContext";
import { useEffect } from "react";
import useLoadPost from "./query/loadPost";

function App() {
  const { navigate } = useMyContext();
  const { data } = useLoadUser();
  const load = useLoadPost();
  const posts = load.data;
  const location = window.location.pathname;
  useEffect(() => {
    if (!data && navigate) {
      navigate("sign");
    } else if (data) {
      navigate("/");
    }
  }, [data, navigate]);
  return (
    <div className="App">
      {(data && location !== "edit") || (data && location !== "upload") ? (
        <Header data={data} />
      ) : null}
      <Routes>
        <Route path="/" element={<Home data={data} posts={posts} />}></Route>
        <Route path="/detail" element={<Detail data={data} />}></Route>
        <Route path="/profile" element={<Profile data={data} />}></Route>
        <Route
          path="/upload"
          element={<Upload data={data} posts={posts} />}
        ></Route>
        <Route path="/edit" element={<Edit />}></Route>
        <Route path="/sign" element={<Sign />}></Route>
        <Route path="/Auth" element={<Auth />}></Route>
      </Routes>
    </div>
  );
}

export default App;
