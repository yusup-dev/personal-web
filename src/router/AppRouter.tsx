import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import Portfolios from "../pages/Portfolio";
import AboutPage from "../pages/AboutPage";
import BlogDetail from "../pages/BlogDetail";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/portfolios" element={<Portfolios />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blogs/:id" element={<BlogDetail/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
