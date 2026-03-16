import axiosClient from "./axiosClient"
import type { Experience } from "../types/experience"
import type { About } from "../types/about"
import type { Skill } from "../types/skill";
import type { Blog } from "../types/blog";
import type { Portfolio } from "../types/portfolio";
import type { Education } from "../types/education";

export const getExperiences = async (): Promise<Experience[]> => {
  const response = await axiosClient.get("/experiences")
  return response.data.data.experience
};

export const getAbout = async(): Promise<About> => {
  const response = await axiosClient.get("/about/1")
  return response.data.data.about
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await axiosClient.get("/skills");
  return response.data.data.skill;
};

export const getBlog = async (): Promise<Blog[]> => {
  const response = await axiosClient.get("/posts");
  return response.data.data.posts;
};

export const getBlogById = async (id: number): Promise<Blog> => {
  const response = await axiosClient.get(`/posts/${id}`);
  return response.data.data.post;
};


export const getPortfolio = async (): Promise<Portfolio[]> => {
  const response = await axiosClient.get("/portfolios");
  return response.data.data.portfolio;
}

export const getEducations = async (): Promise<Education[]> => {
  const response = await axiosClient.get("/educations");
  return response.data.data.education;
}
