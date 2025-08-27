import { apiRequest } from "./queryClient";
import type { Note, InsertNote, UpdateNote, Category, InsertCategory, Tag } from "@shared/schema";

export const api = {
  // Notes
  notes: {
    getAll: (params?: {
      search?: string;
      category?: string;
      tag?: string;
      favorite?: boolean;
      archived?: boolean;
      reminders?: boolean;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.category) searchParams.set("category", params.category);
      if (params?.tag) searchParams.set("tag", params.tag);
      if (params?.favorite) searchParams.set("favorite", "true");
      if (params?.archived) searchParams.set("archived", "true");
      if (params?.reminders) searchParams.set("reminders", "true");
      
      const query = searchParams.toString();
      return fetch(`/api/notes${query ? `?${query}` : ""}`, {
        credentials: "include",
      }).then(res => res.json()) as Promise<Note[]>;
    },

    getById: (id: string) =>
      fetch(`/api/notes/${id}`, { credentials: "include" }).then(res => res.json()) as Promise<Note>,

    create: (note: InsertNote) =>
      apiRequest("POST", "/api/notes", note).then(res => res.json()) as Promise<Note>,

    update: (id: string, note: UpdateNote) =>
      apiRequest("PATCH", `/api/notes/${id}`, note).then(res => res.json()) as Promise<Note>,

    delete: (id: string) =>
      apiRequest("DELETE", `/api/notes/${id}`),
  },

  // Categories
  categories: {
    getAll: () =>
      fetch("/api/categories", { credentials: "include" }).then(res => res.json()) as Promise<Category[]>,

    create: (category: InsertCategory) =>
      apiRequest("POST", "/api/categories", category).then(res => res.json()) as Promise<Category>,

    delete: (id: string) =>
      apiRequest("DELETE", `/api/categories/${id}`),
  },

  // Tags
  tags: {
    getAll: () =>
      fetch("/api/tags", { credentials: "include" }).then(res => res.json()) as Promise<Tag[]>,

    create: (tag: { name: string }) =>
      apiRequest("POST", "/api/tags", tag).then(res => res.json()) as Promise<Tag>,

    delete: (id: string) =>
      apiRequest("DELETE", `/api/tags/${id}`),
  },
};
