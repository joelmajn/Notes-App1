import { type Note, type InsertNote, type UpdateNote, type Category, type InsertCategory, type Tag, type InsertTag } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Notes
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: UpdateNote): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  searchNotes(query: string): Promise<Note[]>;
  getNotesByCategory(categoryId: string): Promise<Note[]>;
  getNotesByTag(tag: string): Promise<Note[]>;
  getFavoriteNotes(): Promise<Note[]>;
  getArchivedNotes(): Promise<Note[]>;
  getNotesWithReminders(): Promise<Note[]>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Tags
  getAllTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private notes: Map<string, Note>;
  private categories: Map<string, Category>;
  private tags: Map<string, Tag>;

  constructor() {
    this.notes = new Map();
    this.categories = new Map();
    this.tags = new Map();

    // Initialize with default categories
    this.initializeDefaultCategories();
  }

  private async initializeDefaultCategories() {
    const defaultCategories = [
      { name: "Trabalho", color: "#3b82f6" },
      { name: "Pessoal", color: "#10b981" },
      { name: "Estudos", color: "#8b5cf6" },
      { name: "Urgente", color: "#ef4444" },
      { name: "Saúde", color: "#14b8a6" },
      { name: "Receitas", color: "#ec4899" },
    ];

    for (const category of defaultCategories) {
      await this.createCategory(category);
    }
  }

  // Notes methods
  async getAllNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = {
      ...insertNote,
      id,
      tags: insertNote.tags || [],
      checklist: insertNote.checklist || [],
      isFavorite: insertNote.isFavorite || false,
      isArchived: insertNote.isArchived || false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updateNote: UpdateNote): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;

    const updatedNote: Note = {
      ...existingNote,
      ...updateNote,
      id,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  async searchNotes(query: string): Promise<Note[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter(note =>
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getNotesByCategory(categoryId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.categoryId === categoryId);
  }

  async getNotesByTag(tag: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.tags.includes(tag));
  }

  async getFavoriteNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.isFavorite);
  }

  async getArchivedNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.isArchived);
  }

  async getNotesWithReminders(): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.reminderDate);
  }

  // Categories methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updateCategory: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;

    const updatedCategory: Category = {
      ...existingCategory,
      ...updateCategory,
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Tags methods
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = randomUUID();
    const tag: Tag = {
      ...insertTag,
      id,
      createdAt: new Date(),
    };
    this.tags.set(id, tag);
    return tag;
  }

  async deleteTag(id: string): Promise<boolean> {
    return this.tags.delete(id);
  }
}

export const storage = new MemStorage();
