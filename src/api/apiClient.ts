import axiosClient from "./axiosClient";
import { parseApiResponse } from "./response";
import {
  aboutSchema,
  skillListSchema,
  experienceListSchema,
  educationListSchema,
  portfolioListSchema,
  blogListSchema,
  blogSchema,
} from "./schemas";
import type { Experience } from "../types/experience";
import type { About } from "../types/about";
import type { Skill } from "../types/skill";
import type { Blog } from "../types/blog";
import type { Portfolio } from "../types/portfolio";
import type { Education } from "../types/education";

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await axiosClient.get("/experiences");
  return parseApiResponse(response.data, experienceListSchema, ["experiences", "experience"]);
};

export const getAbout = async (): Promise<About> => {
  const response = await axiosClient.get("/about/1");
  return parseApiResponse(response.data, aboutSchema, ["about"]);
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await axiosClient.get("/skills");
  return parseApiResponse(response.data, skillListSchema, ["skills", "skill"]);
};

export const getBlog = async (): Promise<Blog[]> => {
  const response = await axiosClient.get("/posts");
  return parseApiResponse(response.data, blogListSchema, ["posts", "blogs"]);
};

export const getBlogById = async (id: number): Promise<Blog> => {
  const response = await axiosClient.get(`/posts/${id}`);
  return parseApiResponse(response.data, blogSchema, ["post", "blog"]);
};

export const getPortfolio = async (): Promise<Portfolio[]> => {
  const response = await axiosClient.get("/portfolios");
  return parseApiResponse(response.data, portfolioListSchema, ["portfolios", "portfolio"]);
};

export const getEducations = async (): Promise<Education[]> => {
  const response = await axiosClient.get("/educations");
  return parseApiResponse(response.data, educationListSchema, ["educations", "education"]);
};

// --- AUTH & CMS MUTATOR ENDPOINTS ---

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  const response = await axiosClient.post("/auth/login", { email, password });
  const data = response.data;
  // Handle various formats of JWT token in envelope
  if (data?.data?.token) return { token: data.data.token };
  if (data?.token) return { token: data.token };
  if (data?.data?.accessToken) return { token: data.data.accessToken };
  if (data?.accessToken) return { token: data.accessToken };
  throw new Error("Invalid login response: missing token");
};

export const updateAbout = async (id: number, data: FormData): Promise<About> => {
  const response = await axiosClient.patch(`/about/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return parseApiResponse(response.data, aboutSchema, ["updatedAbout", "about"]);
};

export const createSkill = async (skill: Omit<Skill, "id">): Promise<Skill> => {
  const response = await axiosClient.post("/skills", skill);
  return response.data;
};

export const updateSkill = async (id: number, skill: Partial<Skill>): Promise<Skill> => {
  const response = await axiosClient.patch(`/skills/${id}`, skill);
  return response.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
  await axiosClient.delete(`/skills/${id}`);
};

export const createExperience = async (exp: Omit<Experience, "id">): Promise<Experience> => {
  const response = await axiosClient.post("/experiences", exp);
  return response.data;
};

export const updateExperience = async (id: number, exp: Partial<Experience>): Promise<Experience> => {
  const response = await axiosClient.patch(`/experiences/${id}`, exp);
  return response.data;
};

export const deleteExperience = async (id: number): Promise<void> => {
  await axiosClient.delete(`/experiences/${id}`);
};

export const createEducation = async (edu: Omit<Education, "id">): Promise<Education> => {
  const response = await axiosClient.post("/educations", edu);
  return response.data;
};

export const updateEducation = async (id: number, edu: Partial<Education>): Promise<Education> => {
  const response = await axiosClient.patch(`/educations/${id}`, edu);
  return response.data;
};

export const deleteEducation = async (id: number): Promise<void> => {
  await axiosClient.delete(`/educations/${id}`);
};

export const createPortfolio = async (port: Omit<Portfolio, "id">): Promise<Portfolio> => {
  const response = await axiosClient.post("/portfolios", port);
  return response.data;
};

export const updatePortfolio = async (id: number, port: Partial<Portfolio>): Promise<Portfolio> => {
  const response = await axiosClient.patch(`/portfolios/${id}`, port);
  return response.data;
};

export const deletePortfolio = async (id: number): Promise<void> => {
  await axiosClient.delete(`/portfolios/${id}`);
};

export const createBlog = async (blog: FormData): Promise<Blog> => {
  const response = await axiosClient.post("/posts", blog, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBlog = async (id: number, blog: FormData): Promise<Blog> => {
  const response = await axiosClient.patch(`/posts/${id}`, blog, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBlog = async (id: number): Promise<void> => {
  await axiosClient.delete(`/posts/${id}`);
};

export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  const apiBase = import.meta.env.VITE_API_URL || "";
  const serverBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${serverBase}${cleanPath}`;
};

