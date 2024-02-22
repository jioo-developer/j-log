import { Route, Routes } from "react-router-dom";
import Sign from "./components/Sign";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import Header from "./components/Header";

function App() {
  const location = window.location.pathname;
  return (
    <div className="App">
      {location === "/" || location === "/profile" || location === "/detail" ? (
        <Header />
      ) : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/Auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
