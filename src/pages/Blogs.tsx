import { useState } from "react";
import { getBlogPaginated } from "../api/apiClient";
import Loader from "../components/Loader";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type BlogsProps = {
  limit?: number;
};

const Blogs = ({ limit }: BlogsProps) => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchBlogs = async (p: number) => {
    setLoading(true);
    try {
      // on home widget use limit as page size, on full blog page use 10
      const pageSize = limit ?? 10;
      const res = await getBlogPaginated(p, pageSize);
      // filter out unpublished posts for public view
      const published = res.blogs.filter((b: any) => b.published !== false);
      setBlogs(published);
      setPagination(res.pagination);
      setPage(p);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  if (!initialized && !loading) {
    fetchBlogs(1);
  }

  const sortedBlogs = [...blogs].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // when used as a summary widget (limit prop), just show first N items
  const post = limit ? sortedBlogs.slice(0, limit) : sortedBlogs;
  const showPagination = !limit && pagination && pagination.totalPages > 1;

  if (loading && !initialized) {
    return <Loader />;
  }

  return (
    <section style={{ maxWidth: "900px", marginTop: "64px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>
        My Blogs.
      </h2>

      {loading && (
        <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>loading…</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {post.map((blog) => (
          <div
            key={blog.id}
            style={{
              display: "flex",
              gap: "40px",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            <span style={{ color: "var(--muted)", minWidth: "120px" }}>
              {formatDate(blog.createdAt)}
            </span>

            <a
              href={`/blogs/${blog.id}`}
              style={{
                color: "var(--fg-strong)",
                textDecoration: "none",
              }}
            >
              {blog.title}
            </a>
          </div>
        ))}

        {post.length === 0 && !loading && (
          <p style={{ color: "var(--muted)", fontSize: "14px" }}>No posts yet.</p>
        )}
      </div>

      {showPagination && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "32px" }}>
          <button
            disabled={!pagination.hasPrevPage || loading}
            onClick={() => fetchBlogs(page - 1)}
            style={{
              background: "transparent",
              border: "none",
              color: pagination.hasPrevPage ? "var(--fg-strong)" : "var(--muted)",
              fontSize: "14px",
              cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
              padding: 0,
            }}
          >
            ← prev
          </button>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
            {page} / {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage || loading}
            onClick={() => fetchBlogs(page + 1)}
            style={{
              background: "transparent",
              border: "none",
              color: pagination.hasNextPage ? "var(--fg-strong)" : "var(--muted)",
              fontSize: "14px",
              cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
              padding: 0,
            }}
          >
            next →
          </button>
        </div>
      )}
    </section>
  );
};

export default Blogs;
