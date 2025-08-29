import { xanoApi } from './xano-api';
import { mockApi } from "./mock-data";
import type { Note, InsertNote, UpdateNote, Category, InsertCategory, Tag } from "../../../shared/schema";

// Flag para alternar entre Xano e dados mock
const USE_XANO = true; // Endpoints do Xano já estão criados

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
    }) => USE_XANO ? xanoApi.notes.list(params) : mockApi.notes.getAll(params),

    getById: (id: string) => USE_XANO ? 
      xanoApi.notes.list({}).then(notes => notes.find(n => n.id === id)) : 
      mockApi.notes.getById(id),

    create: (note: InsertNote) => {
      const noteData = {
        title: note.title,
        content: note.content || "",
        categoryId: note.categoryId || null,
        tags: note.tags || [],
        checklist: note.checklist || [],
        reminderDate: note.reminderDate || null,
        isFavorite: note.isFavorite || false,
        isArchived: note.isArchived || false
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
        reminderDate: note.reminderDate,
        isFavorite: note.isFavorite,
        isArchived: note.isArchived
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
      xanoApi.categories.delete(id) : 
      mockApi.categories.delete(id),
  },

  // Tags (usando dados mock pois Xano store tags como array)
  tags: {
    getAll: () => mockApi.tags.getAll(),
    create: (tag: { name: string }) => mockApi.tags.create(tag),
    delete: (id: string) => mockApi.tags.delete(id),
  },
};