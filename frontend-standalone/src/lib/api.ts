import { xanoApi } from './xano-api';
import { mockApi } from "./mock-data";
import type { Note, InsertNote, UpdateNote, Category, InsertCategory, Tag } from "@shared/schema";

// Flag para alternar entre Xano e dados mock
const USE_XANO = false; // Mude para true após criar os endpoints no Xano

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
    }) => USE_XANO ? xanoApi.notes.list() : mockApi.notes.getAll(params),

    getById: (id: string) => USE_XANO ? 
      xanoApi.notes.list().then(notes => notes.find(n => n.id === id)) : 
      mockApi.notes.getById(id),

    create: (note: InsertNote) => {
      const noteData = {
        title: note.title,
        content: note.content || "",
        categoryId: note.categoryId || null,
        tags: note.tags || [],
        checklist: note.checklist || [],
        reminderDate: note.reminders?.[0]?.date || null,
        isFavorite: note.favorite || false,
        isArchived: note.archived || false
      };
      return USE_XANO ? xanoApi.notes.create(noteData) : mockApi.notes.create(noteData);
    },

    update: (id: string, note: UpdateNote) => {
      const noteData = {
        title: note.title,
        content: note.content,
        categoryId: note.categoryId,
        tags: note.tags,
        checklist: note.checklist,
        reminderDate: note.reminders?.[0]?.date,
        isFavorite: note.favorite,
        isArchived: note.archived
      };
      return USE_XANO ? xanoApi.notes.update(id, noteData) : mockApi.notes.update(id, note);
    },

    delete: (id: string) => USE_XANO ? xanoApi.notes.delete(id) : mockApi.notes.delete(id),
  },

  // Categories
  categories: {
    getAll: () => USE_XANO ? xanoApi.categories.list() : mockApi.categories.getAll(),

    create: (category: InsertCategory) => USE_XANO ? 
      xanoApi.categories.create(category) : 
      mockApi.categories.create(category),

    delete: (id: string) => USE_XANO ? 
      Promise.resolve() : // Xano não tem delete category ainda
      mockApi.categories.delete(id),
  },

  // Tags (usando dados mock pois Xano store tags como array)
  tags: {
    getAll: () => mockApi.tags.getAll(),
    create: (tag: { name: string }) => mockApi.tags.create(tag),
    delete: (id: string) => mockApi.tags.delete(id),
  },
};