import { XANO_CONFIG } from '@/config/xano';
import type { Note, Category } from '@shared/schema';

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
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const xanoApi = {
  notes: {
    list: (): Promise<Note[]> => apiRequest('GET', '/notes'),
    
    create: (data: Partial<Note>): Promise<Note> => 
      apiRequest('POST', '/notes', {
        title: data.title || 'Nova Nota',
        content: data.content || '',
        category_id: data.categoryId || null,
        tags: data.tags || [],
        checklist: data.checklist || [],
        reminder_date: data.reminderDate || null,
        is_favorite: data.isFavorite || false,
        is_archived: data.isArchived || false
      }),
    
    update: (id: string, data: Partial<Note>): Promise<Note> => 
      apiRequest('PATCH', `/notes/${id}`, {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.categoryId && { category_id: data.categoryId }),
        ...(data.tags && { tags: data.tags }),
        ...(data.checklist && { checklist: data.checklist }),
        ...(data.reminderDate !== undefined && { reminder_date: data.reminderDate }),
        ...(data.isFavorite !== undefined && { is_favorite: data.isFavorite }),
        ...(data.isArchived !== undefined && { is_archived: data.isArchived })
      }),
    
    delete: (id: string): Promise<void> => 
      apiRequest('DELETE', `/notes/${id}`)
  },
  
  categories: {
    list: (): Promise<Category[]> => apiRequest('GET', '/categories'),
    
    create: (data: Partial<Category>): Promise<Category> => 
      apiRequest('POST', '/categories', {
        name: data.name || 'Nova Categoria',
        color: data.color || '#6366f1'
      })
  }
};