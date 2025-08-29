import { XANO_CONFIG } from '../config/xano';
import type { Note, Category, ChecklistItem } from '../../../shared/schema';

// Interfaces para dados do Xano (formato snake_case)
interface XanoNote {
  id: number;
  title: string;
  content: string;
  color?: string;
  category_id: number | null;
  tags: string[];
  checklist: ChecklistItem[];
  reminder_date: string | null;
  reminder_repeat?: string;
  start_date?: string;
  end_date?: string;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface XanoCategory {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

const apiRequest = async (method: string, endpoint: string, data?: any) => {
  try {
    const response = await fetch(`${XANO_CONFIG.baseURL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Xano API Request failed:', error);
    throw error;
  }
};

// Conversores de formato
const convertXanoNoteToNote = (xanoNote: XanoNote): Note => ({
  id: xanoNote.id.toString(),
  title: xanoNote.title,
  content: xanoNote.content,
  color: xanoNote.color || null,
  categoryId: xanoNote.category_id?.toString() || null,
  tags: Array.isArray(xanoNote.tags) ? xanoNote.tags : [],
  checklist: Array.isArray(xanoNote.checklist) ? xanoNote.checklist : [],
  reminderDate: xanoNote.reminder_date,
  reminderRepeat: xanoNote.reminder_repeat || null,
  startDate: xanoNote.start_date || null,
  endDate: xanoNote.end_date || null,
  isFavorite: xanoNote.is_favorite || false,
  isArchived: xanoNote.is_archived || false,
  createdAt: new Date(xanoNote.created_at),
  updatedAt: new Date(xanoNote.updated_at),
});

const convertXanoCategoryToCategory = (xanoCategory: XanoCategory): Category => ({
  id: xanoCategory.id.toString(),
  name: xanoCategory.name,
  color: xanoCategory.color,
  createdAt: new Date(xanoCategory.created_at),
});

export const xanoApi = {
  notes: {
    list: async (params?: {
      search?: string;
      category?: string;
      tag?: string;
      favorite?: boolean;
      archived?: boolean;
      reminders?: boolean;
    }): Promise<Note[]> => {
      try {
        const xanoNotes: XanoNote[] = await apiRequest('GET', '/note');
        let filteredNotes = Array.isArray(xanoNotes) ? xanoNotes.map(convertXanoNoteToNote) : [];
        
        // Aplicar filtros no frontend já que o Xano não tem filtros nativos
        if (params?.category) {
          filteredNotes = filteredNotes.filter(note => note.categoryId === params.category);
        }
        
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchLower) ||
            note.content.toLowerCase().includes(searchLower)
          );
        }
        
        if (params?.tag) {
          filteredNotes = filteredNotes.filter(note => 
            note.tags.includes(params.tag!)
          );
        }
        
        if (params?.favorite !== undefined) {
          filteredNotes = filteredNotes.filter(note => note.isFavorite === params.favorite);
        }
        
        if (params?.archived !== undefined) {
          filteredNotes = filteredNotes.filter(note => note.isArchived === params.archived);
        }
        
        return filteredNotes;
      } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
      }
    },
    
    create: async (data: Partial<Note>): Promise<Note> => {
      const xanoNote: XanoNote = await apiRequest('POST', '/note', {
        title: data.title || 'Nova Nota',
        content: data.content || '',
        color: data.color || null,
        category_id: data.categoryId ? parseInt(data.categoryId) : null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        checklist: Array.isArray(data.checklist) ? data.checklist : [],
        reminder_date: data.reminderDate || null,
        reminder_repeat: data.reminderRepeat || null,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        is_favorite: data.isFavorite || false,
        is_archived: data.isArchived || false
      });
      return convertXanoNoteToNote(xanoNote);
    },
    
    update: async (id: string, data: Partial<Note>): Promise<Note> => {
      const updateData: any = {};
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.color !== undefined) updateData.color = data.color;
      if (data.categoryId !== undefined) {
        updateData.category_id = data.categoryId ? parseInt(data.categoryId) : null;
      }
      if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags : [];
      if (data.checklist !== undefined) updateData.checklist = Array.isArray(data.checklist) ? data.checklist : [];
      if (data.reminderDate !== undefined) updateData.reminder_date = data.reminderDate;
      if (data.reminderRepeat !== undefined) updateData.reminder_repeat = data.reminderRepeat;
      if (data.startDate !== undefined) updateData.start_date = data.startDate;
      if (data.endDate !== undefined) updateData.end_date = data.endDate;
      if (data.isFavorite !== undefined) updateData.is_favorite = data.isFavorite;
      if (data.isArchived !== undefined) updateData.is_archived = data.isArchived;
      
      const xanoNote: XanoNote = await apiRequest('PATCH', `/note/${id}`, updateData);
      return convertXanoNoteToNote(xanoNote);
    },
    
    delete: async (id: string): Promise<void> => {
      await apiRequest('DELETE', `/note/${id}`);
    }
  },
  
  categories: {
    list: async (): Promise<Category[]> => {
      try {
        const xanoCategories: XanoCategory[] = await apiRequest('GET', '/category');
        return Array.isArray(xanoCategories) ? xanoCategories.map(convertXanoCategoryToCategory) : [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    
    create: async (data: Partial<Category>): Promise<Category> => {
      const xanoCategory: XanoCategory = await apiRequest('POST', '/category', {
        name: data.name || 'Nova Categoria',
        color: data.color || '#6366f1'
      });
      return convertXanoCategoryToCategory(xanoCategory);
    },

    delete: async (id: string): Promise<void> => {
      await apiRequest('DELETE', `/category/${id}`);
    }
  }
};