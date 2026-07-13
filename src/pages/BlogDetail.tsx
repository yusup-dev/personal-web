import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Loader from "../components/Loader";
import type { Blog } from "../types/blog";

const defaultFallbackBlog: Blog = {
  id: 0,
  title: "Blog Not Found",
  content: "The requested blog post could not be loaded from the server.",
  image: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&auto=format&fit=crop&q=60",
  createdAt: new Date().toISOString(),
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogDetail = () => {
  const { id } = useParams();
  const blogId = Number(id || 0);

  const fallbackBlog = defaultFallbackBlog;

  const fetchFn = useCallback(() => getBlogById(blogId), [blogId]);
  const { data: blog, loading, error } = useQuery(fetchFn, fallbackBlog, `blog_${blogId}`);

  if (loading) {
    return <Loader />;
  }

  if (error && blog.id === 0) {
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
      
      <div className="markdown-body" style={{ lineHeight: "1.8", fontSize: "18px" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
        >
          {blog.content}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default BlogDetail;
