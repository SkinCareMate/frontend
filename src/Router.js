import { Routes, Route } from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/useraccount/Login";
import ImageMotion from "./pages/imageMotion/ImageMotion";
import Signup from "./pages/useraccount/Signup";
import Mypage from "./pages/useraccount/Mypage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/imagemotion" element={<ImageMotion />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}

export default Router;