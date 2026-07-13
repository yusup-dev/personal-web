import { getBlog } from "../api/apiClient";
import { useQuery } from "../hooks/useQuery";
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
  const { data: blogs, loading } = useQuery(getBlog, [], "blogs");

  const post = limit ? blogs.slice(0, limit) : blogs;

  if (loading) {
    return <Loader />;
  }

  return (
    <section style={{ maxWidth: "900px", marginTop: "80px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "24px", marginTop: "50px" }}>
        My Blogs.
      </h2>

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
            <span style={{ color: "#9ca3af", minWidth: "120px" }}>
              {formatDate(blog.createdAt)}
            </span>

            <a
              href={`/blogs/${blog.id}`}
              style={{
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {blog.title}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
