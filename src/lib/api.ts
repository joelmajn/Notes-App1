import { mockApi } from "./mock-data";
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
    }) => mockApi.notes.getAll(params),

    getById: (id: string) => mockApi.notes.getById(id),

    create: (note: InsertNote) => {
      const noteData = {
        title: note.title,
        content: note.content || "",
        categoryId: note.categoryId || null,
        tags: note.tags || [],
        checklist: note.checklist || [],
        reminders: note.reminders || [],
        favorite: note.favorite || false,
        archived: note.archived || false
      };
      return mockApi.notes.create(noteData);
    },

    update: (id: string, note: UpdateNote) => mockApi.notes.update(id, note),

    delete: (id: string) => mockApi.notes.delete(id),
  },

  // Categories
  categories: {
    getAll: () => mockApi.categories.getAll(),

    create: (category: InsertCategory) => mockApi.categories.create(category),

    delete: (id: string) => mockApi.categories.delete(id),
  },

  // Tags
  tags: {
    getAll: () => mockApi.tags.getAll(),

    create: (tag: { name: string }) => mockApi.tags.create(tag),

    delete: (id: string) => mockApi.tags.delete(id),
  },
};
