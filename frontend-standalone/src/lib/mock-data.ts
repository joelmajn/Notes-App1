import type { Note, Category, Tag } from "@shared/schema";

// Mock data para o frontend standalone
export const mockCategories: Category[] = [
  {
    id: "c4f8a1b2-3d5e-6f7g-8h9i-0j1k2l3m4n5o",
    name: "Estudos",
    color: "#8b5cf6"
  },
  {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
    name: "Trabalho",
    color: "#ef4444"
  },
  {
    id: "b2c3d4e5-f6g7-8h9i-0j1k-2l3m4n5o6p7q",
    name: "Pessoal",
    color: "#22c55e"
  },
  {
    id: "c3d4e5f6-g7h8-9i0j-1k2l-3m4n5o6p7q8r",
    name: "Ideias",
    color: "#f59e0b"
  }
];

export const mockTags: Tag[] = [
  { id: "tag1", name: "importante" },
  { id: "tag2", name: "urgente" },
  { id: "tag3", name: "revisão" },
  { id: "tag4", name: "projeto" },
  { id: "tag5", name: "reunião" }
];

export const mockNotes: Note[] = [
  {
    id: "note1",
    title: "Lista de Tarefas Diárias",
    content: "# Tarefas para hoje\n\n- Revisar código do projeto\n- Reunião com equipe às 14h\n- Estudar novas tecnologias\n- Fazer exercícios",
    categoryId: "c4f8a1b2-3d5e-6f7g-8h9i-0j1k2l3m4n5o",
    tags: ["importante", "urgente"],
    checklist: [
      { id: "1", text: "Revisar código", completed: true },
      { id: "2", text: "Reunião equipe", completed: false },
      { id: "3", text: "Estudar tecnologias", completed: false },
      { id: "4", text: "Exercícios", completed: false }
    ],
    reminders: [],
    favorite: true,
    archived: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T15:30:00Z')
  },
  {
    id: "note2",
    title: "Ideias para Projeto Mobile",
    content: "## App de Notas\n\n- Interface intuitiva\n- Sincronização na nuvem\n- Modo offline\n- Temas personalizáveis\n- Busca avançada",
    categoryId: "c3d4e5f6-g7h8-9i0j-1k2l-3m4n5o6p7q8r",
    tags: ["projeto", "mobile"],
    checklist: [],
    reminders: [
      {
        id: "r1",
        date: new Date('2024-02-01T09:00:00Z'),
        repeat: "none",
        title: "Revisar ideias do projeto"
      }
    ],
    favorite: false,
    archived: false,
    createdAt: new Date('2024-01-10T14:20:00Z'),
    updatedAt: new Date('2024-01-12T11:15:00Z')
  },
  {
    id: "note3",
    title: "Notas da Reunião",
    content: "**Data:** 12/01/2024\n**Participantes:** João, Maria, Pedro\n\n### Pontos Discutidos:\n1. Novo design do sistema\n2. Cronograma de entregas\n3. Definição de responsabilidades\n\n### Próximos Passos:\n- Criar protótipo\n- Revisar documentação\n- Agendar próxima reunião",
    categoryId: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
    tags: ["reunião", "trabalho"],
    checklist: [
      { id: "1", text: "Criar protótipo", completed: false },
      { id: "2", text: "Revisar documentação", completed: false },
      { id: "3", text: "Agendar próxima reunião", completed: true }
    ],
    reminders: [],
    favorite: false,
    archived: false,
    createdAt: new Date('2024-01-12T16:45:00Z'),
    updatedAt: new Date('2024-01-12T17:00:00Z')
  },
  {
    id: "note4",
    title: "Receita de Bolo de Chocolate",
    content: "## Ingredientes:\n- 2 xícaras de farinha\n- 1 xícara de açúcar\n- 1/2 xícara de cacau em pó\n- 3 ovos\n- 1 xícara de leite\n- 1/2 xícara de óleo\n\n## Modo de Preparo:\n1. Misture os ingredientes secos\n2. Adicione os líquidos\n3. Bata bem a massa\n4. Asse por 40 minutos a 180°C",
    categoryId: "b2c3d4e5-f6g7-8h9i-0j1k-2l3m4n5o6p7q",
    tags: ["receita", "culinária"],
    checklist: [],
    reminders: [],
    favorite: true,
    archived: false,
    createdAt: new Date('2024-01-08T20:30:00Z'),
    updatedAt: new Date('2024-01-08T20:45:00Z')
  },
  {
    id: "note5",
    title: "Nota Arquivada - Projeto Antigo",
    content: "Esta é uma nota arquivada de um projeto que foi finalizado. Contém informações importantes que podem ser consultadas futuramente.",
    categoryId: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
    tags: ["arquivo", "projeto"],
    checklist: [],
    reminders: [],
    favorite: false,
    archived: true,
    createdAt: new Date('2023-12-15T10:00:00Z'),
    updatedAt: new Date('2023-12-20T14:30:00Z')
  }
];

// Simulação de armazenamento local
let localNotes = [...mockNotes];
let localCategories = [...mockCategories];
let localTags = [...mockTags];

// Funções para simular operações de API
export const mockApi = {
  notes: {
    getAll: async (params?: {
      search?: string;
      category?: string;
      tag?: string;
      favorite?: boolean;
      archived?: boolean;
      reminders?: boolean;
    }): Promise<Note[]> => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simula delay da API
      
      let filteredNotes = [...localNotes];
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredNotes = filteredNotes.filter(note => 
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
        );
      }
      
      if (params?.category) {
        filteredNotes = filteredNotes.filter(note => note.categoryId === params.category);
      }
      
      if (params?.tag) {
        filteredNotes = filteredNotes.filter(note => note.tags.includes(params.tag!));
      }
      
      if (params?.favorite !== undefined) {
        filteredNotes = filteredNotes.filter(note => note.favorite === params.favorite);
      }
      
      if (params?.archived !== undefined) {
        filteredNotes = filteredNotes.filter(note => note.archived === params.archived);
      }
      
      if (params?.reminders) {
        filteredNotes = filteredNotes.filter(note => note.reminders.length > 0);
      }
      
      return filteredNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },

    getById: async (id: string): Promise<Note> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      const note = localNotes.find(n => n.id === id);
      if (!note) throw new Error('Nota não encontrada');
      return note;
    },

    create: async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      const newNote: Note = {
        ...noteData,
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      localNotes.unshift(newNote);
      return newNote;
    },

    update: async (id: string, updateData: Partial<Note>): Promise<Note> => {
      await new Promise(resolve => setTimeout(resolve, 150));
      const index = localNotes.findIndex(n => n.id === id);
      if (index === -1) throw new Error('Nota não encontrada');
      
      localNotes[index] = {
        ...localNotes[index],
        ...updateData,
        updatedAt: new Date()
      };
      return localNotes[index];
    },

    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      localNotes = localNotes.filter(n => n.id !== id);
    }
  },

  categories: {
    getAll: async (): Promise<Category[]> => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return [...localCategories];
    },

    create: async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const newCategory: Category = {
        ...categoryData,
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      localCategories.push(newCategory);
      return newCategory;
    },

    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      localCategories = localCategories.filter(c => c.id !== id);
      // Remover categoria das notas
      localNotes = localNotes.map(note => 
        note.categoryId === id ? { ...note, categoryId: null } : note
      );
    }
  },

  tags: {
    getAll: async (): Promise<Tag[]> => {
      await new Promise(resolve => setTimeout(resolve, 30));
      return [...localTags];
    },

    create: async (tagData: { name: string }): Promise<Tag> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const newTag: Tag = {
        id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: tagData.name
      };
      localTags.push(newTag);
      return newTag;
    },

    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const tag = localTags.find(t => t.id === id);
      if (tag) {
        localTags = localTags.filter(t => t.id !== id);
        // Remover tag das notas
        localNotes = localNotes.map(note => ({
          ...note,
          tags: note.tags.filter(t => t !== tag.name)
        }));
      }
    }
  }
};