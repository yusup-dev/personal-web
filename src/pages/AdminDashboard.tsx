import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAbout,
  getSkills,
  getExperiences,
  getEducations,
  getPortfolio,
  getBlog,
  updateAbout,
  createSkill,
  updateSkill,
  deleteSkill,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  createBlog,
  updateBlog,
  deleteBlog,
  getVisitorStats,
  getAllVisitors,
  getImageUrl,
} from "../api/apiClient";
import type { About } from "../types/about";
import type { Skill } from "../types/skill";
import type { Experience } from "../types/experience";
import type { Education } from "../types/education";
import type { Portfolio } from "../types/portfolio";
import type { Blog } from "../types/blog";
import Loader from "../components/Loader";



type Tab = "about" | "skills" | "experiences" | "educations" | "portfolios" | "blogs" | "visitors";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for data lists
  const [about, setAbout] = useState<About | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  // Visitor stats state
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const [visitorList, setVisitorList] = useState<any[]>([]);

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/login");
    } else {
      fetchData(activeTab);
    }
  }, [navigate, activeTab]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const fetchData = async (tab: Tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === "about") {
        const res = await getAbout();
        setAbout(res);
      } else if (tab === "skills") {
        const res = await getSkills();
        setSkills(res);
      } else if (tab === "experiences") {
        const res = await getExperiences();
        setExperiences(res);
      } else if (tab === "educations") {
        const res = await getEducations();
        setEducations(res);
      } else if (tab === "portfolios") {
        const res = await getPortfolio();
        setPortfolios(res);
      } else if (tab === "blogs") {
        const res = await getBlog();
        setBlogs(res);
      } else if (tab === "visitors") {
        // Fetch visitor statistics and list (first page)
        const stats = await getVisitorStats();
        setVisitorStats(stats);
        const list = await getAllVisitors();
        setVisitorList(list.visitors);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  const handleAboutSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", about.title);
      formData.append("shortDescription", about.shortDescription);
      formData.append("description", about.description);
      formData.append("contactLink", about.contactLink);
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const res = await updateAbout(1, formData);
      setAbout(res);
      setPdfFile(null);
      showSuccess("profile updated.");
    } catch (err: any) {
      console.error(err);
      setError("failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const openFormNew = () => {
    setIsNew(true);
    setError(null);
    setBlogImageFile(null);
    if (activeTab === "skills") {
      setEditingItem({ name: "", category: "" });
    } else if (activeTab === "experiences") {
      setEditingItem({ position: "", company: "", location: "", startDate: "", endDate: "", description: "" });
    } else if (activeTab === "educations") {
      setEditingItem({ degree: "", school: "", location: "", startDate: "", endDate: "", gpa: "", description: "" });
    } else if (activeTab === "portfolios") {
      setEditingItem({ title: "", github: "", article: "", createdAt: new Date().toISOString().split("T")[0] });
    } else if (activeTab === "blogs") {
      setEditingItem({ title: "", content: "", image: "", createdAt: new Date().toISOString().split("T")[0] });
    }
    setIsFormOpen(true);
  };

  const openFormEdit = (item: any) => {
    setIsNew(false);
    setError(null);
    setBlogImageFile(null);
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "skills") {
        if (isNew) await createSkill(editingItem);
        else await updateSkill(editingItem.id, editingItem);
      } else if (activeTab === "experiences") {
        if (isNew) await createExperience(editingItem);
        else await updateExperience(editingItem.id, editingItem);
      } else if (activeTab === "educations") {
        if (isNew) await createEducation(editingItem);
        else await updateEducation(editingItem.id, editingItem);
      } else if (activeTab === "portfolios") {
        if (isNew) await createPortfolio(editingItem);
        else await updatePortfolio(editingItem.id, editingItem);
      } else if (activeTab === "blogs") {
        const formData = new FormData();
        formData.append("title", editingItem.title);
        formData.append("content", editingItem.content);
        formData.append("createdAt", editingItem.createdAt);
        if (blogImageFile) {
          formData.append("image", blogImageFile);
        } else if (!isNew && editingItem.image) {
          formData.append("image", editingItem.image);
        }

        if (isNew) await createBlog(formData);
        else await updateBlog(editingItem.id, formData);
        setBlogImageFile(null);
      }
      setIsFormOpen(false);
      setEditingItem(null);
      showSuccess("saved successfully.");
      fetchData(activeTab);
    } catch (err: any) {
      setError("failed to save item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("are you sure?")) return;
    setLoading(true);
    try {
      if (activeTab === "skills") await deleteSkill(id);
      else if (activeTab === "experiences") await deleteExperience(id);
      else if (activeTab === "educations") await deleteEducation(id);
      else if (activeTab === "portfolios") await deletePortfolio(id);
      else if (activeTab === "blogs") await deleteBlog(id);
      showSuccess("deleted successfully.");
      fetchData(activeTab);
    } catch (err: any) {
      setError("failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  const getActiveListLength = () => {
    if (activeTab === "skills") return skills.length;
    if (activeTab === "experiences") return experiences.length;
    if (activeTab === "educations") return educations.length;
    if (activeTab === "portfolios") return portfolios.length;
    if (activeTab === "blogs") return blogs.length;
    return 0;
  };

  return (
    <section style={{ maxWidth: "900px", marginTop: "64px", color: "var(--fg-strong)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px" }}>Dashboard.</h2>
        <button onClick={handleLogout} style={plainButtonStyle}>
          [logout]
        </button>
      </div>

      {/* Notifications */}
      {success && <p style={{ color: "var(--success)", fontSize: "14px", marginBottom: "20px" }}>{success}</p>}
      {error && <p style={{ color: "var(--danger)", fontSize: "14px", marginBottom: "20px" }}>{error}</p>}

      {/* Navigation (Simple links) */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
        {(["about", "skills", "experiences", "educations", "portfolios", "blogs", "visitors"]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as Tab);
              setIsFormOpen(false);
              setBlogImageFile(null);
              setPdfFile(null);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: activeTab === tab ? "var(--fg-strong)" : "var(--muted)",
              fontSize: "14px",
              cursor: "pointer",
              padding: 0,
              textDecoration: activeTab === tab ? "underline" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && <Loader />}

      {/* Main Panel Content */}
      {!loading && (
        <div>
          {/* ABOUT TAB */}
          {activeTab === "about" && about && (
            <form onSubmit={handleAboutSave} style={formGridStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>title</label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>short description</label>
                <textarea
                  value={about.shortDescription}
                  onChange={(e) => setAbout({ ...about, shortDescription: e.target.value })}
                  style={textareaStyle}
                  rows={2}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>description</label>
                <textarea
                  value={about.description}
                  onChange={(e) => setAbout({ ...about, description: e.target.value })}
                  style={textareaStyle}
                  rows={5}
                  required
                />
              </div>

              <div className="admin-grid">
                <div style={formGroupStyle}>
                  <label style={labelStyle}>contact link</label>
                  <input
                    type="text"
                    value={about.contactLink}
                    onChange={(e) => setAbout({ ...about, contactLink: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>resume pdf file</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPdfFile(e.target.files[0]);
                      }
                    }}
                    style={{ color: "var(--fg-strong)", fontSize: "14px", marginTop: "6px" }}
                  />
                  {about.resumeUrl && (
                    <a
                      href={`${import.meta.env.VITE_API_URL}/about/1/download`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "underline", alignSelf: "flex-start", marginTop: "4px" }}
                    >
                      view current resume
                    </a>
                  )}
                </div>
              </div>

              <button type="submit" style={actionButtonStyle}>
                save profile
              </button>
            </form>
          )}

          {/* OTHER TABS */}
          {activeTab !== "about" && activeTab !== "visitors" && (
            <div>
              {/* Form View (Shown Inline when creating/editing) */}
              {isFormOpen && editingItem ? (
                <form onSubmit={handleFormSubmit} style={formGridStyle}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
                    {isNew ? "new" : "edit"} {activeTab.slice(0, -1)}
                  </h3>

                  {activeTab === "skills" && (
                    <>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>skill name</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>category</label>
                        <input
                          type="text"
                          placeholder="e.g. Backend, Frontend"
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "experiences" && (
                    <>
                      <div className="admin-grid">
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>position</label>
                          <input
                            type="text"
                            value={editingItem.position}
                            onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>company</label>
                          <input
                            type="text"
                            value={editingItem.company}
                            onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div className="admin-grid">
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>start date</label>
                          <input
                            type="date"
                            value={editingItem.startDate ? editingItem.startDate.split("T")[0] : ""}
                            onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>end date (optional)</label>
                          <input
                            type="date"
                            value={editingItem.endDate ? editingItem.endDate.split("T")[0] : ""}
                            onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>location</label>
                        <input
                          type="text"
                          value={editingItem.location}
                          onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>description</label>
                        <textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          style={textareaStyle}
                          rows={4}
                          required
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "educations" && (
                    <>
                      <div className="admin-grid">
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>school / university</label>
                          <input
                            type="text"
                            value={editingItem.school}
                            onChange={(e) => setEditingItem({ ...editingItem, school: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>degree / major</label>
                          <input
                            type="text"
                            value={editingItem.degree}
                            onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div className="admin-grid">
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>start date</label>
                          <input
                            type="date"
                            value={editingItem.startDate ? editingItem.startDate.split("T")[0] : ""}
                            onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>end date (optional)</label>
                          <input
                            type="date"
                            value={editingItem.endDate ? editingItem.endDate.split("T")[0] : ""}
                            onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="admin-grid">
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>location</label>
                          <input
                            type="text"
                            value={editingItem.location}
                            onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>gpa</label>
                          <input
                            type="text"
                            value={editingItem.gpa}
                            onChange={(e) => setEditingItem({ ...editingItem, gpa: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>description</label>
                        <textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          style={textareaStyle}
                          rows={3}
                          required
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "portfolios" && (
                    <>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>title</label>
                        <input
                          type="text"
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                      <div className="admin-grid">
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>github url</label>
                          <input
                            type="text"
                            value={editingItem.github}
                            onChange={(e) => setEditingItem({ ...editingItem, github: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div style={formGroupStyle}>
                          <label style={labelStyle}>article url</label>
                          <input
                            type="text"
                            value={editingItem.article}
                            onChange={(e) => setEditingItem({ ...editingItem, article: e.target.value })}
                            style={inputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>date</label>
                        <input
                          type="date"
                          value={editingItem.createdAt ? editingItem.createdAt.split("T")[0] : ""}
                          onChange={(e) => setEditingItem({ ...editingItem, createdAt: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "blogs" && (
                    <>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>title</label>
                        <input
                          type="text"
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>image file</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setBlogImageFile(e.target.files[0]);
                            }
                          }}
                          style={{ color: "var(--fg-strong)", fontSize: "14px", marginTop: "6px" }}
                          required={isNew}
                        />
                        {editingItem.image && (
                          <div style={{ marginTop: "8px" }}>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>current image:</span>
                            <img
                              src={getImageUrl(editingItem.image)}
                              alt="blog"
                              style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "4px", marginTop: "4px", display: "block" }}
                            />
                          </div>
                        )}
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>date</label>
                        <input
                          type="date"
                          value={editingItem.createdAt ? editingItem.createdAt.split("T")[0] : ""}
                          onChange={(e) => setEditingItem({ ...editingItem, createdAt: e.target.value })}
                          style={inputStyle}
                          required
                        />
                      </div>
                      <div style={formGroupStyle}>
                        <label style={labelStyle}>content (markdown)</label>
                        <textarea
                          value={editingItem.content}
                          onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                          style={textareaStyle}
                          rows={8}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
                    <button type="submit" style={actionButtonStyle}>
                      save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        setBlogImageFile(null);
                      }}
                      style={plainButtonStyle}
                    >
                      [cancel]
                    </button>
                  </div>
                </form>
              ) : (
                /* List View (Minimal rows, similar to home/blogs) */
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
                    <button onClick={openFormNew} style={actionButtonStyle}>
                      + add new
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {activeTab === "skills" &&
                      skills.map((item) => (
                        <div key={item.id} className="admin-row">
                          <div className="admin-row-info">
                            <span className="admin-row-meta">{item.category}</span>
                            <span className="admin-row-title">{item.name}</span>
                          </div>
                          <div className="admin-row-actions">
                            <button onClick={() => openFormEdit(item)} style={plainButtonStyle}>
                              [edit]
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={plainDangerStyle}>
                              [delete]
                            </button>
                          </div>
                        </div>
                      ))}

                    {activeTab === "experiences" &&
                      [...experiences]
                        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                        .map((item) => (
                          <div key={item.id} className="admin-row">
                            <div className="admin-row-info">
                              <span className="admin-row-meta">{item.company}</span>
                              <span className="admin-row-title">{item.position}</span>
                            </div>
                            <div className="admin-row-actions">
                              <button onClick={() => openFormEdit(item)} style={plainButtonStyle}>
                                [edit]
                              </button>
                              <button onClick={() => handleDelete(item.id!)} style={plainDangerStyle}>
                                [delete]
                              </button>
                            </div>
                          </div>
                        ))}

                    {activeTab === "educations" &&
                      [...educations]
                        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                        .map((item) => (
                          <div key={item.id} className="admin-row">
                            <div className="admin-row-info">
                              <span className="admin-row-meta">{item.school}</span>
                              <span className="admin-row-title">{item.degree}</span>
                            </div>
                            <div className="admin-row-actions">
                              <button onClick={() => openFormEdit(item)} style={plainButtonStyle}>
                                [edit]
                              </button>
                              <button onClick={() => handleDelete(item.id!)} style={plainDangerStyle}>
                                [delete]
                              </button>
                            </div>
                          </div>
                        ))}

                    {activeTab === "portfolios" &&
                      [...portfolios]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((item) => (
                          <div key={item.id} className="admin-row">
                            <div className="admin-row-info">
                              <span className="admin-row-meta">{item.createdAt}</span>
                              <span className="admin-row-title">{item.title}</span>
                            </div>
                            <div className="admin-row-actions">
                              <button onClick={() => openFormEdit(item)} style={plainButtonStyle}>
                                [edit]
                              </button>
                              <button onClick={() => handleDelete(item.id!)} style={plainDangerStyle}>
                                [delete]
                              </button>
                            </div>
                          </div>
                        ))}

                    {activeTab === "blogs" &&
                      [...blogs]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((item) => (
                          <div key={item.id} className="admin-row">
                            <div className="admin-row-info">
                              <span className="admin-row-meta">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <span className="admin-row-title">{item.title}</span>
                            </div>
                            <div className="admin-row-actions">
                              <button onClick={() => openFormEdit(item)} style={plainButtonStyle}>
                                [edit]
                              </button>
                              <button onClick={() => handleDelete(item.id!)} style={plainDangerStyle}>
                                [delete]
                              </button>
                            </div>
                          </div>
                        ))}
                    {getActiveListLength() === 0 && (
                      <p style={{ opacity: 0.5, fontSize: "14px" }}>No items found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISITORS TAB */}
          {activeTab === "visitors" && visitorStats && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* Stat Cards Container */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={cardStyle}>
                  <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Views</div>
                  <div style={{ fontSize: "28px", fontWeight: "600", color: "var(--fg-strong)", marginTop: "4px" }}>{visitorStats.totalAllTime}</div>
                </div>
                <div style={cardStyle}>
                  <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Unique Visitors</div>
                  <div style={{ fontSize: "28px", fontWeight: "600", color: "var(--fg-strong)", marginTop: "4px" }}>{visitorStats.uniqueVisitorsAllTime}</div>
                </div>
                <div style={cardStyle}>
                  <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last {visitorStats.totalLast?.days ?? 30} Days</div>
                  <div style={{ fontSize: "28px", fontWeight: "600", color: "var(--fg-strong)", marginTop: "4px" }}>{visitorStats.totalLast?.count ?? 0}</div>
                </div>
              </div>

              {/* Data Tables Grid */}
              <div className="admin-grid" style={{ gap: "24px" }}>
                {/* Top Paths Card */}
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--fg-strong)", marginBottom: "16px" }}>Top Visited Pages</h3>
                  <table style={visitorTableStyle}>
                    <thead>
                      <tr>
                        <th style={visitorThStyle}>Path</th>
                        <th style={{ ...visitorThStyle, width: "80px", textAlign: "right" }}>Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorStats.topPaths?.map((p: any) => (
                        <tr key={p.path} style={trHoverStyle}>
                          <td style={{ ...visitorTdStyle, fontFamily: "monospace", fontSize: "13px" }}>{p.path}</td>
                          <td style={{ ...visitorTdStyle, textAlign: "right", fontWeight: "500" }}>{p.visits}</td>
                        </tr>
                      ))}
                      {(!visitorStats.topPaths || visitorStats.topPaths.length === 0) && (
                        <tr>
                          <td colSpan={2} style={{ ...visitorTdStyle, opacity: 0.5, textAlign: "center" }}>No data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Daily Visits Card */}
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--fg-strong)", marginBottom: "16px" }}>Daily Trend</h3>
                  <table style={visitorTableStyle}>
                    <thead>
                      <tr>
                        <th style={visitorThStyle}>Date</th>
                        <th style={{ ...visitorThStyle, width: "80px", textAlign: "right" }}>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorStats.daily?.map((d: any) => (
                        <tr key={d.date} style={trHoverStyle}>
                          <td style={visitorTdStyle}>{d.date}</td>
                          <td style={{ ...visitorTdStyle, textAlign: "right", fontWeight: "500" }}>{d.count}</td>
                        </tr>
                      ))}
                      {(!visitorStats.daily || visitorStats.daily.length === 0) && (
                        <tr>
                          <td colSpan={2} style={{ ...visitorTdStyle, opacity: 0.5, textAlign: "center" }}>No data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visitor List Logs */}
              {visitorList && visitorList.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--fg-strong)", marginBottom: "20px" }}>
                      Visitor Logs
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {visitorList.map((v: any) => (
                        <div key={v.id} className="admin-row" style={{ alignItems: "flex-start", paddingBottom: "16px" }}>
                          <div className="admin-row-info" style={{ flex: 1, gap: "16px" }}>
                            {/* Metadata containing IP and Path */}
                            <div className="admin-row-meta" style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px" }}>
                              <span style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--fg-strong)", fontWeight: "500" }}>{v.ip}</span>
                              <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "monospace" }}>{v.path}</span>
                            </div>
                            
                            {/* User Agent Content */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
                              <span 
                                style={{ fontSize: "13px", color: "var(--fg)", wordBreak: "break-all", opacity: 0.85 }} 
                                title={v.userAgent}
                              >
                                {v.userAgent?.slice(0, 75) ?? "-"}
                                {v.userAgent?.length > 75 && "..."}
                              </span>
                            </div>
                          </div>

                          {/* Created Time formatted like the actions column in other rows */}
                          <div style={{ flexShrink: 0, textAlign: "right" }}>
                            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                              {new Date(v.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};


// --- MINIMAL STYLING ---
const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  padding: "20px",
  borderRadius: "8px",
};

const visitorTableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const visitorThStyle: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid var(--border-strong)",
  padding: "10px 12px",
  background: "var(--table-header)",
  color: "var(--fg-strong)",
  fontWeight: "500",
};

const visitorTdStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--table-border)",
  color: "var(--fg-80)",
};

const trHoverStyle: React.CSSProperties = {
  transition: "background-color 0.2s ease",
};

const plainButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--muted)",
  fontSize: "14px",
  cursor: "pointer",
  padding: 0,
  textDecoration: "underline",
};

const plainDangerStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--danger)",
  fontSize: "14px",
  cursor: "pointer",
  padding: 0,
  textDecoration: "underline",
};

const actionButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--border-strong)",
  color: "var(--fg-strong)",
  padding: "8px 18px",
  fontSize: "13px",
  cursor: "pointer",
  transition: "border-color 0.2s ease",
};


const formGridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const formGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--muted)",
};

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--border-input)",
  padding: "8px 0",
  color: "var(--fg-strong)",
  fontSize: "15px",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--border-input)",
  borderRadius: "4px",
  padding: "10px",
  color: "var(--fg-strong)",
  fontSize: "15px",
  outline: "none",
  fontFamily: "Inter, system-ui, sans-serif",
  resize: "vertical",
};


export default AdminDashboard;
