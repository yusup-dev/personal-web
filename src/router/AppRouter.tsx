import { Routes, Route } from "react-router-dom";
// import Hero from "../pages/Home";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import Portfolios from "../pages/Portfolio";
import AboutPage from "../pages/AboutPage";
import BlogDetail from "../pages/BlogDetail";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/portfolios" element={<Portfolios />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blogs/:id" element={<BlogDetail/>}/>
    </Routes>
  );
};

export default AppRouter;
