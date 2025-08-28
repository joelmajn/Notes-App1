// Configuração corrigida para integração Xano
const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:G2JBF9sk';

// Interfaces para dados do Xano (formato snake_case)
interface XanoNote {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  tags: string[];
  checklist: string[];
  reminder_date: string | null;
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

// Interfaces para o frontend (formato camelCase)
interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  checklist: string[];
  reminderDate: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const apiRequest = async (method: string, endpoint: string, data?: any) => {
  try {
    const response = await fetch(`${XANO_BASE_URL}${endpoint}`, {
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
  categoryId: xanoNote.category_id?.toString() || null,
  tags: Array.isArray(xanoNote.tags) ? xanoNote.tags : [],
  checklist: Array.isArray(xanoNote.checklist) ? xanoNote.checklist : [],
  reminderDate: xanoNote.reminder_date,
  isFavorite: xanoNote.is_favorite || false,
  isArchived: xanoNote.is_archived || false,
  createdAt: xanoNote.created_at,
  updatedAt: xanoNote.updated_at,
});

const convertXanoCategoryToCategory = (xanoCategory: XanoCategory): Category => ({
  id: xanoCategory.id.toString(),
  name: xanoCategory.name,
  color: xanoCategory.color,
});

export const xanoApi = {
  notes: {
    list: async (): Promise<Note[]> => {
      try {
        const xanoNotes: XanoNote[] = await apiRequest('GET', '/note');
        return Array.isArray(xanoNotes) ? xanoNotes.map(convertXanoNoteToNote) : [];
      } catch (error) {
        console.error('Error fetching notes:', error);
        return [];
      }
    },
    
    create: async (data: Partial<Note>): Promise<Note> => {
      const xanoNote: XanoNote = await apiRequest('POST', '/note', {
        title: data.title || 'Nova Nota',
        content: data.content || '',
        category_id: data.categoryId ? parseInt(data.categoryId) : null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        checklist: Array.isArray(data.checklist) ? data.checklist : [],
        reminder_date: data.reminderDate || null,
        is_favorite: data.isFavorite || false,
        is_archived: data.isArchived || false
      });
      return convertXanoNoteToNote(xanoNote);
    },
    
    update: async (id: string, data: Partial<Note>): Promise<Note> => {
      const updateData: any = {};
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.categoryId !== undefined) {
        updateData.category_id = data.categoryId ? parseInt(data.categoryId) : null;
      }
      if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags : [];
      if (data.checklist !== undefined) updateData.checklist = Array.isArray(data.checklist) ? data.checklist : [];
      if (data.reminderDate !== undefined) updateData.reminder_date = data.reminderDate;
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
    }
  }
};