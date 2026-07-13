import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBlogById, getImageUrl } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Loader from "../components/Loader";
import Mermaid from "../components/Mermaid";
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
      <section style={{ marginTop: "64px", color: "var(--fg-strong)" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>Post Not Found.</h2>
        <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
          The blog post you are looking for does not exist or has been removed.
        </p>
        <a href="/blogs" className="btn-outline">
          Back to Blogs
        </a>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "64px auto",
        color: "var(--fg-strong)",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>{blog.title}</h1>

      <p style={{ color: "var(--muted)", marginBottom: "30px" }}>
        {formatDate(blog.createdAt)}
      </p>

      {blog.image && (
        <img
          src={getImageUrl(blog.image)}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: "500px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        />
      )}
      
      <div className="markdown-body" style={{ lineHeight: "1.8", fontSize: "18px" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeSlug]}
          components={{
            table({ node, ...props }) {
              return (
                <div style={{ overflowX: "auto", width: "100%", margin: "28px 0" }}>
                  <table style={{ margin: 0 }} {...props} />
                </div>
              );
            },
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const isMermaid = match && match[1] === "mermaid";
              if (isMermaid) {
                return <Mermaid chart={String(children).replace(/\n$/, "")} />;
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default BlogDetail;
