import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Blog } from "../types/blog";
import { getBlogById } from "../api/apiClient";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Loader from "../components/Loader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogDetail = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;

        const data = await getBlogById(Number(id));
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return (
      <p style={{ color: "#9ca3af", marginTop: "80px" }}>Blog not found!!</p>
    );
  }

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>{blog.title}</h1>

      <p style={{ color: "#9ca3af", marginBottom: "30px" }}>
        {formatDate(blog.createdAt)}
      </p>

      <img
        src={blog.image}
        alt={blog.title}
        style={{
          width: "100%",
          maxHeight: "500px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      />
      
      <div style={{ lineHeight: "1.8", fontSize: "18px" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {blog.content}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default BlogDetail;
