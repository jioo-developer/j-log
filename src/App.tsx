import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Upload from "./components/editor/Upload";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Edit from "./components/editor/Edit";
import Header from "./components/Header";
import { useMyContext } from "./module/Mycontext";
import { EditorProvider } from "./components/editor/EditorContext";

function App() {
  const { location, Loading } = useMyContext();
  if (Loading) {
    return <div className="App" />;
  }

  const contextRoute = [
    { path: "/profile", element: <Profile /> },
    { path: "/upload", element: <Upload /> },
    { path: "/edit", element: <Edit /> },
  ];

  return (
    <div className="App">
      {location.pathname === "/detail" ||
      location.pathname === "/profile" ||
      location.pathname === "/" ? (
        <Header />
      ) : null}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/detail" element={<Detail />}></Route>
        {contextRoute.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<EditorProvider>{route.element}</EditorProvider>}
          />
        ))}
        <Route path="/sign" element={<Sign />}></Route>
        <Route path="/Auth" element={<Auth />}></Route>
      </Routes>
    </div>
  );
}

export default App;
