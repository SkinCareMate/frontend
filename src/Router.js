import { Routes, Route } from "react-router-dom";
import Home from "./pages/main/Home";
import Login from "./pages/useraccount/Login";
import ImageMotion from "./pages/imageMotion/ImageMotion";
import Signup from "./pages/useraccount/Signup";
import Mypage from "./pages/useraccount/Mypage";
import AIAnalysis from "./pages/AIAnalysis";
import LLMResult from "./pages/LLMResult";
import CosmeticRecommend from "./pages/CosmeticRecommend";
import Survey from "./pages/Survey";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/imagemotion" element={<ImageMotion />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/survey" element={<Mypage />} />
      <Route path="/aianalysis" element={<AIAnalysis />} />
      <Route path="/llmresult" element={<LLMResult />} />
      <Route path="/cosmeticrecommend" element={<CosmeticRecommend />} />
      <Route path="/dd" element={<Survey />} />
    </Routes>
  );
}

export default Router;