import { z } from "zod";

export const aboutSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  contactLink: z.string(),
  resumeUrl: z.string(),
});

export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
});

export const experienceSchema = z.object({
  id: z.number().optional(),
  position: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  description: z.string(),
});

export const educationSchema = z.object({
  id: z.number().optional(),
  degree: z.string(),
  school: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  gpa: z.string(),
  description: z.string(),
});

export const portfolioSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  github: z.string(),
  article: z.string(),
  createdAt: z.string(),
});

export const blogSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  content: z.string(),
  image: z.string(),
  createdAt: z.string(),
});

export const aboutListSchema = z.array(aboutSchema);
export const skillListSchema = z.array(skillSchema);
export const experienceListSchema = z.array(experienceSchema);
export const educationListSchema = z.array(educationSchema);
export const portfolioListSchema = z.array(portfolioSchema);
export const blogListSchema = z.array(blogSchema);
