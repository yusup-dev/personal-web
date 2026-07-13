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
