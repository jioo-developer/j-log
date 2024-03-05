import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import Header from "./components/Header";
import { useMyContext } from "./module/Mycontext";

function App() {
  const { location, Loading } = useMyContext();
  if (Loading) {
    return <div className="App" />;
  }

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
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/edit" element={<Edit />}></Route>
        <Route path="/sign" element={<Sign />}></Route>
        <Route path="/Auth" element={<Auth />}></Route>
      </Routes>
    </div>
  );
}

export default App;
