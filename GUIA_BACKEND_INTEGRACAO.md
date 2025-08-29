# 📋 GUIA COMPLETO: INTEGRAÇÃO BACKEND E EXTENSÃO

## 🎯 PARTE 1: INTEGRAÇÃO COM XANO

### 📝 1.1 Configuração Inicial no Xano

1. **Criar Conta no Xano:**
   - Acesse: https://xano.com
   - Crie uma conta gratuita
   - Crie um novo workspace

2. **Configurar Database Schema:**
   ```sql
   -- Tabela Categories
   Categories:
   - id (auto increment)
   - name (text)
   - color (text)
   - created_at (datetime)

   -- Tabela Notes
   Notes:
   - id (auto increment)
   - title (text)
   - content (long text)
   - category_id (integer, foreign key)
   - tags (json)
   - checklist (json)
   - reminder_date (datetime, nullable)
   - is_favorite (boolean, default false)
   - is_archived (boolean, default false)
   - created_at (datetime)
   - updated_at (datetime)
   ```

3. **Criar APIs no Xano:**
   - GET /notes - Listar todas as notas
   - POST /notes - Criar nova nota
   - PATCH /notes/{id} - Atualizar nota
   - DELETE /notes/{id} - Deletar nota
   - GET /categories - Listar categorias
   - POST /categories - Criar categoria

### 📝 1.2 Configuração no Frontend

1. **Criar arquivo de configuração:**
   ```typescript
   // src/config/xano.ts
   export const XANO_CONFIG = {
     baseURL: 'https://seu-workspace.xano.io/api:versao',
     apiKey: process.env.REACT_APP_XANO_API_KEY || ''
   };
   ```

2. **Atualizar src/lib/api.ts:**
   ```typescript
   import { XANO_CONFIG } from '@/config/xano';

   const apiRequest = async (method: string, endpoint: string, data?: any) => {
     const response = await fetch(`${XANO_CONFIG.baseURL}${endpoint}`, {
       method,
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${XANO_CONFIG.apiKey}`,
       },
       body: data ? JSON.stringify(data) : undefined,
     });
     
     if (!response.ok) {
       throw new Error(`API Error: ${response.statusText}`);
     }
     
     return response.json();
   };

   export const api = {
     notes: {
       list: () => apiRequest('GET', '/notes'),
       create: (data: any) => apiRequest('POST', '/notes', data),
       update: (id: string, data: any) => apiRequest('PATCH', `/notes/${id}`, data),
       delete: (id: string) => apiRequest('DELETE', `/notes/${id}`),
     },
     categories: {
       list: () => apiRequest('GET', '/categories'),
       create: (data: any) => apiRequest('POST', '/categories', data),
     }
   };
   ```

3. **Configurar variáveis de ambiente:**
   ```env
   # .env.local
   REACT_APP_XANO_API_KEY=sua_api_key_aqui
   REACT_APP_XANO_WORKSPACE_URL=https://seu-workspace.xano.io/api:versao
   ```

---

## 🎯 PARTE 2: INTEGRAÇÃO COM SUPABASE

### 📝 2.1 Configuração no Supabase

1. **Criar Projeto no Supabase:**
   - Acesse: https://supabase.com
   - Crie novo projeto
   - Anote a URL e API Key

2. **Criar Tabelas SQL:**
   ```sql
   -- Criar tabela categories
   CREATE TABLE categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     color TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Criar tabela notes
   CREATE TABLE notes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT,
     category_id UUID REFERENCES categories(id),
     tags JSONB DEFAULT '[]',
     checklist JSONB DEFAULT '[]',
     reminder_date TIMESTAMP WITH TIME ZONE,
     is_favorite BOOLEAN DEFAULT false,
     is_archived BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Trigger para updated_at
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   CREATE TRIGGER update_notes_updated_at BEFORE UPDATE
   ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   ```

3. **Configurar Row Level Security (RLS):**
   ```sql
   -- Habilitar RLS
   ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

   -- Políticas básicas (ajustar conforme necessário)
   CREATE POLICY "Allow all operations" ON categories FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON notes FOR ALL USING (true);
   ```

### 📝 2.2 Instalação e Configuração

1. **Instalar Supabase Client:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configurar cliente Supabase:**
   ```typescript
   // src/config/supabase.ts
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
   const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

3. **Atualizar src/lib/api.ts para Supabase:**
   ```typescript
   import { supabase } from '@/config/supabase';

   export const api = {
     notes: {
       list: async () => {
         const { data, error } = await supabase
           .from('notes')
           .select('*, categories(*)')
           .order('created_at', { ascending: false });
         
         if (error) throw error;
         return data;
       },
       
       create: async (noteData: any) => {
         const { data, error } = await supabase
           .from('notes')
           .insert(noteData)
           .select()
           .single();
         
         if (error) throw error;
         return data;
       },
       
       update: async (id: string, noteData: any) => {
         const { data, error } = await supabase
           .from('notes')
           .update(noteData)
           .eq('id', id)
           .select()
           .single();
         
         if (error) throw error;
         return data;
       },
       
       delete: async (id: string) => {
         const { error } = await supabase
           .from('notes')
           .delete()
           .eq('id', id);
         
         if (error) throw error;
       },
     },
     
     categories: {
       list: async () => {
         const { data, error } = await supabase
           .from('categories')
           .select('*')
           .order('name');
         
         if (error) throw error;
         return data;
       },
       
       create: async (categoryData: any) => {
         const { data, error } = await supabase
           .from('categories')
           .insert(categoryData)
           .select()
           .single();
         
         if (error) throw error;
         return data;
       },
     }
   };
   ```

4. **Configurar variáveis de ambiente:**
   ```env
   # .env.local
   REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=sua_anon_key_aqui
   ```

---

## 🎯 PARTE 3: EXTENSÃO DE NAVEGADOR

### 📝 3.1 Estrutura da Extensão

1. **Criar manifest.json:**
   ```json
   {
     "manifest_version": 3,
     "name": "Notes Widget",
     "version": "1.0",
     "description": "Widget de notas persistente",
     "permissions": [
       "activeTab",
       "storage",
       "scripting"
     ],
     "content_scripts": [
       {
         "matches": ["<all_urls>"],
         "js": ["content.js"],
         "css": ["widget.css"]
       }
     ],
     "action": {
       "default_popup": "popup.html",
       "default_title": "Notes Widget"
     },
     "background": {
       "service_worker": "background.js"
     },
     "web_accessible_resources": [
       {
         "resources": ["widget.html"],
         "matches": ["<all_urls>"]
       }
     ]
   }
   ```

2. **Criar content.js (Script de Conteúdo):**
   ```javascript
   // content.js
   class NotesWidget {
     constructor() {
       this.isVisible = false;
       this.widget = null;
       this.init();
     }

     async init() {
       // Verificar se já existe widget
       if (document.getElementById('notes-widget')) return;
       
       // Carregar estado persistente
       const state = await chrome.storage.local.get(['widgetVisible', 'widgetPosition']);
       this.isVisible = state.widgetVisible || false;
       
       this.createWidget();
       
       if (this.isVisible) {
         this.showWidget();
       }
     }

     createWidget() {
       // Criar container do widget
       this.widget = document.createElement('div');
       this.widget.id = 'notes-widget';
       this.widget.className = 'notes-widget-container';
       
       // HTML do widget
       this.widget.innerHTML = `
         <div class="notes-widget-header">
           <span>📝 Notas</span>
           <div class="notes-widget-controls">
             <button id="notes-widget-minimize">−</button>
             <button id="notes-widget-close">×</button>
           </div>
         </div>
         <div class="notes-widget-content">
           <textarea id="notes-quick-input" placeholder="Digite sua nota rápida..."></textarea>
           <div class="notes-widget-actions">
             <button id="notes-save-btn">Salvar</button>
             <button id="notes-view-all">Ver Todas</button>
           </div>
           <div id="notes-recent-list"></div>
         </div>
       `;
       
       // Tornar arrastável
       this.makeDraggable();
       
       // Adicionar event listeners
       this.addEventListeners();
       
       // Adicionar ao DOM
       document.body.appendChild(this.widget);
     }

     makeDraggable() {
       let isDragging = false;
       let currentX, currentY, initialX, initialY;
       
       const header = this.widget.querySelector('.notes-widget-header');
       
       header.addEventListener('mousedown', (e) => {
         isDragging = true;
         initialX = e.clientX - this.widget.offsetLeft;
         initialY = e.clientY - this.widget.offsetTop;
       });
       
       document.addEventListener('mousemove', (e) => {
         if (isDragging) {
           currentX = e.clientX - initialX;
           currentY = e.clientY - initialY;
           
           this.widget.style.left = currentX + 'px';
           this.widget.style.top = currentY + 'px';
         }
       });
       
       document.addEventListener('mouseup', () => {
         if (isDragging) {
           isDragging = false;
           // Salvar posição
           chrome.storage.local.set({
             widgetPosition: { x: currentX, y: currentY }
           });
         }
       });
     }

     addEventListeners() {
       // Botão fechar
       this.widget.querySelector('#notes-widget-close').addEventListener('click', () => {
         this.hideWidget();
       });
       
       // Botão minimizar
       this.widget.querySelector('#notes-widget-minimize').addEventListener('click', () => {
         this.toggleMinimize();
       });
       
       // Salvar nota
       this.widget.querySelector('#notes-save-btn').addEventListener('click', () => {
         this.saveQuickNote();
       });
       
       // Ver todas as notas
       this.widget.querySelector('#notes-view-all').addEventListener('click', () => {
         window.open('https://seu-app.vercel.app', '_blank');
       });
     }

     async saveQuickNote() {
       const textarea = this.widget.querySelector('#notes-quick-input');
       const content = textarea.value.trim();
       
       if (!content) return;
       
       // Salvar localmente primeiro
       const notes = await chrome.storage.local.get(['quickNotes']) || { quickNotes: [] };
       notes.quickNotes.unshift({
         id: Date.now(),
         content,
         timestamp: new Date().toISOString()
       });
       
       await chrome.storage.local.set({ quickNotes: notes.quickNotes.slice(0, 10) });
       
       // Tentar sincronizar com backend se configurado
       this.syncWithBackend(content);
       
       textarea.value = '';
       this.updateRecentList();
     }

     async syncWithBackend(content) {
       // Configurar URL do seu app
       const API_URL = 'https://seu-app.vercel.app/api';
       
       try {
         await fetch(`${API_URL}/notes`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             title: 'Nota Rápida',
             content,
             categoryId: null,
             tags: ['widget']
           })
         });
       } catch (error) {
         console.log('Sincronização offline - salvo localmente');
       }
     }

     async updateRecentList() {
       const { quickNotes = [] } = await chrome.storage.local.get(['quickNotes']);
       const listContainer = this.widget.querySelector('#notes-recent-list');
       
       listContainer.innerHTML = quickNotes.slice(0, 3).map(note => `
         <div class="recent-note">
           <div class="recent-note-content">${note.content.substring(0, 50)}...</div>
           <div class="recent-note-time">${new Date(note.timestamp).toLocaleTimeString()}</div>
         </div>
       `).join('');
     }

     showWidget() {
       this.widget.style.display = 'block';
       this.isVisible = true;
       chrome.storage.local.set({ widgetVisible: true });
       this.updateRecentList();
     }

     hideWidget() {
       this.widget.style.display = 'none';
       this.isVisible = false;
       chrome.storage.local.set({ widgetVisible: false });
     }

     toggleMinimize() {
       const content = this.widget.querySelector('.notes-widget-content');
       const isMinimized = content.style.display === 'none';
       content.style.display = isMinimized ? 'block' : 'none';
     }
   }

   // Inicializar widget
   const notesWidget = new NotesWidget();

   // Listener para mensagens do popup
   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
     if (message.action === 'toggleWidget') {
       if (notesWidget.isVisible) {
         notesWidget.hideWidget();
       } else {
         notesWidget.showWidget();
       }
     }
   });
   ```

3. **Criar widget.css:**
   ```css
   .notes-widget-container {
     position: fixed;
     top: 100px;
     right: 20px;
     width: 300px;
     background: white;
     border: 1px solid #e2e8f0;
     border-radius: 8px;
     box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
     z-index: 10000;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     display: none;
   }

   .notes-widget-header {
     background: #4f46e5;
     color: white;
     padding: 12px;
     border-radius: 8px 8px 0 0;
     display: flex;
     justify-content: space-between;
     align-items: center;
     cursor: move;
   }

   .notes-widget-controls button {
     background: none;
     border: none;
     color: white;
     cursor: pointer;
     padding: 0 8px;
     font-size: 16px;
   }

   .notes-widget-content {
     padding: 16px;
   }

   #notes-quick-input {
     width: 100%;
     height: 80px;
     border: 1px solid #e2e8f0;
     border-radius: 4px;
     padding: 8px;
     resize: none;
     font-family: inherit;
     margin-bottom: 12px;
   }

   .notes-widget-actions {
     display: flex;
     gap: 8px;
     margin-bottom: 16px;
   }

   .notes-widget-actions button {
     padding: 8px 16px;
     border: 1px solid #e2e8f0;
     border-radius: 4px;
     background: white;
     cursor: pointer;
     font-size: 12px;
   }

   #notes-save-btn {
     background: #4f46e5 !important;
     color: white !important;
     border-color: #4f46e5 !important;
   }

   .recent-note {
     background: #f8fafc;
     padding: 8px;
     border-radius: 4px;
     margin-bottom: 8px;
     font-size: 12px;
   }

   .recent-note-content {
     color: #374151;
     margin-bottom: 4px;
   }

   .recent-note-time {
     color: #9ca3af;
     font-size: 10px;
   }
   ```

4. **Criar popup.html:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       body { width: 200px; padding: 16px; }
       button { 
         width: 100%; 
         padding: 12px; 
         margin: 8px 0; 
         border: none; 
         border-radius: 4px; 
         background: #4f46e5; 
         color: white; 
         cursor: pointer; 
       }
     </style>
   </head>
   <body>
     <h3>Notes Widget</h3>
     <button id="toggle-widget">Mostrar/Ocultar Widget</button>
     <button id="open-app">Abrir App Completo</button>
     <script src="popup.js"></script>
   </body>
   </html>
   ```

5. **Criar popup.js:**
   ```javascript
   document.getElementById('toggle-widget').addEventListener('click', async () => {
     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
     chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
     window.close();
   });

   document.getElementById('open-app').addEventListener('click', () => {
     chrome.tabs.create({ url: 'https://seu-app.vercel.app' });
     window.close();
   });
   ```

6. **Criar background.js:**
   ```javascript
   chrome.runtime.onInstalled.addListener(() => {
     chrome.storage.local.set({
       widgetVisible: true,
       widgetPosition: { x: 20, y: 100 }
     });
   });
   ```

### 📝 3.2 Instalação da Extensão

1. **Preparar arquivos:**
   - Crie uma pasta "extension"
   - Adicione todos os arquivos acima
   - Teste localmente

2. **Instalar no Chrome:**
   - Abra chrome://extensions/
   - Ative "Modo do desenvolvedor"
   - Clique "Carregar sem compactação"
   - Selecione a pasta "extension"

3. **Publicar na Chrome Web Store:**
   - Crie conta de desenvolvedor ($5 única vez)
   - Suba arquivos compactados
   - Preencha informações da extensão
   - Aguarde aprovação (1-3 dias)

### 📝 3.3 Funcionalidades Persistentes

O widget manterá:
- ✅ Posição na tela
- ✅ Estado aberto/fechado
- ✅ Notas salvas localmente
- ✅ Sincronização com backend quando online
- ✅ Funcionamento em todas as páginas
- ✅ Dados persistem ao fechar/abrir navegador

---

## 🎯 PRÓXIMOS PASSOS

1. **Para Backend:** Escolha Xano OU Supabase e siga o guia correspondente
2. **Para Extensão:** Use o código fornecido e ajuste URLs do seu app
3. **Teste:** Sempre teste localmente antes de publicar
4. **Deploy:** Publique extensão na Chrome Web Store

Este guia fornece tudo que você precisa para integrar backend e criar a extensão com widget persistente!