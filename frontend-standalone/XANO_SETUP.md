# 🎯 CONFIGURAÇÃO XANO - PASSO A PASSO

## 1. 📋 TABELAS PARA CRIAR NO XANO

### Tabela: `categories`
```
Campos:
- id (auto increment) ✅ Primary Key
- name (text) ✅ Required
- color (text) ✅ Required
- created_at (datetime) ✅ Auto-fill on create
```

### Tabela: `notes`
```
Campos:
- id (auto increment) ✅ Primary Key
- title (text) ✅ Required
- content (long text)
- category_id (integer) - Foreign Key para categories
- tags (json)
- checklist (json)
- reminder_date (datetime)
- is_favorite (boolean) ✅ Default: false
- is_archived (boolean) ✅ Default: false
- created_at (datetime) ✅ Auto-fill on create
- updated_at (datetime) ✅ Auto-fill on update
```

## 2. 🔗 ENDPOINTS PARA CRIAR NO XANO

### GET /notes
- Método: GET
- Retorna: Lista de todas as notas

### POST /notes
- Método: POST
- Body: 
```json
{
  "title": "string",
  "content": "string",
  "category_id": "number",
  "tags": "array",
  "checklist": "array",
  "reminder_date": "datetime",
  "is_favorite": "boolean",
  "is_archived": "boolean"
}
```

### PATCH /notes/{id}
- Método: PATCH
- Path Parameter: id
- Body: Campos que serão atualizados

### DELETE /notes/{id}
- Método: DELETE
- Path Parameter: id

### GET /categories
- Método: GET
- Retorna: Lista de todas as categorias

### POST /categories
- Método: POST
- Body:
```json
{
  "name": "string",
  "color": "string"
}
```

## 3. ✅ ARQUIVOS JÁ CRIADOS

- ✅ `src/config/xano.ts` - Configuração da API
- ✅ `src/lib/xano-api.ts` - Funções da API Xano
- ✅ `src/lib/api.ts` - API unificada (mock + Xano)

## 4. 🚀 COMO ATIVAR

No arquivo `src/lib/api.ts`, a constante `USE_XANO` já está como `true`.

Para testar primeiro com dados mock, mude para:
```typescript
const USE_XANO = false;
```

## 5. 🔄 PRÓXIMOS PASSOS

1. Configure as tabelas no Xano conforme acima
2. Crie os endpoints no Xano
3. Faça deploy no Vercel
4. Teste a integração

Sua API Xano: `https://x8ki-letl-twmt.n7.xano.io/api:G2JBF9sk`