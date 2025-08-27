# 🚀 Guia Completo de Deployment - NotesApp

Este guia completo te ajudará a fazer deploy da aplicação NotesApp seguindo o fluxo: **GitHub → Vercel → Xano Backend**.

## 📋 Índice
- [Pré-requisitos](#pré-requisitos)
- [Etapa 1: GitHub](#etapa-1-github)
- [Etapa 2: Vercel](#etapa-2-vercel)
- [Etapa 3: Xano Backend](#etapa-3-xano-backend)
- [Etapa 4: Extensão do Navegador](#etapa-4-extensão-do-navegador)
- [Configurações Finais](#configurações-finais)
- [Solução de Problemas](#solução-de-problemas)

## Pré-requisitos

### Contas Necessárias
- [ ] Conta no [GitHub](https://github.com)
- [ ] Conta no [Vercel](https://vercel.com)
- [ ] Conta no [Xano](https://xano.com)

### Ferramentas
- [ ] Git instalado
- [ ] Node.js 18+ instalado
- [ ] Editor de código (VS Code recomendado)

## Etapa 1: GitHub

### 1.1 Preparar o Repositório

```bash
# 1. Inicializar repositório Git
git init

# 2. Adicionar arquivos
git add .

# 3. Fazer commit inicial
git commit -m "🎉 Initial commit - NotesApp Full Stack"

# 4. Conectar ao repositório remoto
git remote add origin https://github.com/SEU-USUARIO/notesapp.git

# 5. Push para GitHub
git branch -M main
git push -u origin main
```

### 1.2 Estrutura do Repositório
Certifique-se de que seu repositório tenha esta estrutura:
```
notesapp/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schemas compartilhados
├── extension/       # Extensão do navegador
├── package.json     # Dependências
├── vite.config.ts   # Configuração Vite
├── vercel.json      # Configuração Vercel
└── DEPLOYMENT.md    # Este guia
```

### 1.3 Criar vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server/index.ts": {
      "maxDuration": 30
    }
  }
}
```

## Etapa 2: Vercel

### 2.1 Deploy Inicial

1. **Conectar GitHub ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Import Project"
   - Selecione seu repositório GitHub

2. **Configurar o Projeto**
   ```
   Project Name: notesapp
   Framework Preset: Other
   Root Directory: ./
   Build Command: npm run build
   Output Directory: client/dist
   Install Command: npm install
   ```

3. **Variáveis de Ambiente**
   No dashboard do Vercel, vá em Settings > Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   XANO_API_URL=https://sua-instancia.xano.io
   XANO_API_KEY=sua-chave-api
   ```

### 2.2 Configurar Scripts de Build

Edite o `package.json`:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "tsc server/index.ts --outDir dist",
    "start": "node server/index.js",
    "vercel-build": "npm run build:client"
  }
}
```

## Etapa 3: Xano Backend

### 3.1 Criar Projeto no Xano

1. **Configurar Database Schema**
   ```sql
   -- Tabela: categories
   id: int (auto increment, primary key)
   name: text
   color: text
   created_at: datetime (auto)
   updated_at: datetime (auto)

   -- Tabela: notes  
   id: int (auto increment, primary key)
   title: text
   content: text
   category_id: int (foreign key -> categories.id)
   tags: json
   checklist: json
   reminder_date: datetime
   reminder_repeat: text
   is_favorite: boolean
   is_archived: boolean
   created_at: datetime (auto)
   updated_at: datetime (auto)
   ```

2. **Criar API Endpoints**

   **GET /api/notes**
   ```javascript
   // Buscar todas as notas
   let notes = this.runSQL(`
     SELECT * FROM notes 
     WHERE is_archived = false 
     ORDER BY updated_at DESC
   `)
   
   return notes
   ```

   **POST /api/notes**
   ```javascript
   // Criar nova nota
   let { title, content, category_id, tags, checklist, reminder_date, reminder_repeat } = request.body
   
   let result = this.runSQL(`
     INSERT INTO notes (title, content, category_id, tags, checklist, reminder_date, reminder_repeat)
     VALUES (?, ?, ?, ?, ?, ?, ?)
   `, [title, content, category_id, JSON.stringify(tags), JSON.stringify(checklist), reminder_date, reminder_repeat])
   
   return { id: result.insertId, message: "Note created successfully" }
   ```

   **PUT /api/notes/:id**
   ```javascript
   // Atualizar nota
   let noteId = request.params.id
   let { title, content, category_id, tags, checklist, reminder_date, reminder_repeat, is_favorite, is_archived } = request.body
   
   this.runSQL(`
     UPDATE notes 
     SET title=?, content=?, category_id=?, tags=?, checklist=?, reminder_date=?, reminder_repeat=?, is_favorite=?, is_archived=?, updated_at=NOW()
     WHERE id=?
   `, [title, content, category_id, JSON.stringify(tags), JSON.stringify(checklist), reminder_date, reminder_repeat, is_favorite, is_archived, noteId])
   
   return { message: "Note updated successfully" }
   ```

   **DELETE /api/notes/:id**
   ```javascript
   // Deletar nota
   let noteId = request.params.id
   
   this.runSQL(`DELETE FROM notes WHERE id = ?`, [noteId])
   
   return { message: "Note deleted successfully" }
   ```

### 3.2 Configurar CORS

No Xano, configure CORS settings:
```
Allowed Origins: 
- https://seu-app.vercel.app
- chrome-extension://*
- moz-extension://*

Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization, X-Requested-With
```

### 3.3 Atualizar Frontend para Xano

Modifique `client/src/lib/queryClient.ts`:
```typescript
const API_BASE = import.meta.env.VITE_XANO_API_URL || 'https://sua-instancia.xano.io/api/v1';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(`${API_BASE}${queryKey[0]}`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_XANO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return response.json();
      },
    },
  },
});

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_XANO_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error('Request failed');
  }
  
  return response.json();
};
```

## Etapa 4: Extensão do Navegador

### 4.1 Criar Ícones

Crie ícones nas seguintes dimensões:
- `extension/icons/icon16.png` (16x16px)
- `extension/icons/icon32.png` (32x32px) 
- `extension/icons/icon48.png` (48x48px)
- `extension/icons/icon128.png` (128x128px)

### 4.2 Configurar URLs da API

Atualize os arquivos da extensão substituindo `https://your-app-domain.vercel.app` pela URL real do seu app.

### 4.3 Build da Extensão

```bash
# Criar pasta de build da extensão
mkdir extension-build

# Copiar arquivos necessários
cp -r extension/* extension-build/

# Comprimir para upload
zip -r notesapp-extension.zip extension-build/*
```

### 4.4 Publicar na Chrome Web Store

1. Acesse [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Clique em "Add new item"
3. Faça upload do arquivo `notesapp-extension.zip`
4. Preencha as informações:
   - Nome: "NotesApp - Gerenciador de Notas"
   - Descrição: "Aplicativo completo de notas com categorias, tags, checklists e lembretes"
   - Categoria: "Productivity"
   - Screenshots: Capturas da extensão funcionando

## Configurações Finais

### 5.1 Configurar Domínio Customizado (Opcional)

No Vercel:
1. Vá em Settings > Domains
2. Adicione seu domínio personalizado
3. Configure DNS:
   ```
   Type: CNAME
   Name: www (ou @)
   Value: alias.vercel.app
   ```

### 5.2 Configurar Analytics

Adicione Google Analytics no `client/public/index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 5.3 Configurar PWA

Certifique-se de que `client/public/manifest.json` está configurado:
```json
{
  "name": "NotesApp",
  "short_name": "NotesApp",
  "description": "Aplicativo completo de notas",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Solução de Problemas

### Build Errors
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar versões
node --version  # Deve ser 18+
npm --version
```

### Problemas de CORS
- Verificar se o Xano está configurado para aceitar requests do seu domínio
- Adicionar headers CORS no servidor

### Extensão não funciona
- Verificar se as URLs da API estão corretas
- Testar em modo desenvolvedor primeiro
- Verificar console do navegador para erros

### Deploy falha no Vercel
- Verificar se `vercel.json` está correto
- Confirmar variáveis de ambiente
- Ver logs de build no dashboard do Vercel

## 🎉 Parabéns!

Seu NotesApp agora está:
- ✅ Hospedado no Vercel
- ✅ Conectado ao Xano como backend
- ✅ Disponível como extensão do navegador
- ✅ Funcionando como PWA

### Próximos Passos
- [ ] Monitorar métricas de uso
- [ ] Implementar backup automático 
- [ ] Adicionar recursos de colaboração
- [ ] Otimizar performance
- [ ] Solicitar feedback dos usuários

---

**Suporte**: Se tiver problemas, verifique a documentação oficial de cada plataforma ou abra uma issue no GitHub.