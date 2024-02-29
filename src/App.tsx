import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import Header from "./components/Header";
import useLoadUser from "./query/loadUser";
import useLoadPost from "./query/loadPost";

function App() {
  const { data, refetch, isLoading } = useLoadUser();
  const {
    data: posts,
    refetch: postRefetch,
    isLoading: postIsLoading,
  } = useLoadPost();
  const location = window.location.pathname;

  if (postIsLoading) {
    return <div className="App" />;
  }

  return (
    <div className="App">
      {(data && location !== "edit") || (data && location !== "upload") ? (
        <Header data={data} refetch={refetch} isLoading={isLoading} />
      ) : null}
      <Routes>
        <Route path="/" element={<Home data={data} posts={posts} />}></Route>
        <Route
          path="/detail"
          element={<Detail data={data} postRefetch={postRefetch} />}
        ></Route>
        <Route
          path="/profile"
          element={<Profile data={data} refetch={refetch} />}
        ></Route>
        <Route
          path="/upload"
          element={<Upload data={data} posts={posts} />}
        ></Route>
        <Route path="/edit" element={<Edit />}></Route>
        <Route
          path="/sign"
          element={<Sign data={data} refetch={refetch} />}
        ></Route>
        <Route path="/Auth" element={<Auth refetch={refetch} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
