# 🔧 ENDPOINTS DO XANO - CONFIGURAÇÃO NECESSÁRIA

Baseado na estrutura das suas tabelas, você precisa criar estes endpoints no Xano:

## 📋 TABELAS CRIADAS (conforme imagem):

### ✅ Tabela `category`:
- id (integer)
- created_at (timestamp)  
- name (text)
- color (text)

### ✅ Tabela `note`:
- id (integer)
- created_at (timestamp)
- title (text)
- content (text)
- tags ([text])
- checklist ([text])
- reminder_date (timestamp)
- is_favorite (bool)
- is_archived (bool)
- updated_at (timestamp)
- category_id (integer)

---

## 🔗 ENDPOINTS PARA CRIAR NO XANO:

### 1. **GET /category** - Listar categorias
- Método: GET
- Retorna: Array de categorias

### 2. **POST /category** - Criar categoria
- Método: POST
- Body:
```json
{
  "name": "string",
  "color": "string"
}
```

### 3. **GET /note** - Listar notas
- Método: GET
- Retorna: Array de notas

### 4. **POST /note** - Criar nota
- Método: POST
- Body:
```json
{
  "title": "string",
  "content": "string",
  "category_id": "integer",
  "tags": "array",
  "checklist": "array",
  "reminder_date": "timestamp",
  "is_favorite": "boolean",
  "is_archived": "boolean"
}
```

### 5. **PATCH /note/{id}** - Atualizar nota
- Método: PATCH
- Path Parameter: id
- Body: Campos que serão atualizados

### 6. **DELETE /note/{id}** - Deletar nota
- Método: DELETE
- Path Parameter: id

---

## ⚠️ IMPORTANT NOTES:

1. **Endpoints usam singular**: `/note` e `/category` (não `/notes` e `/categories`)
2. **Campo category_id**: Use integer, não string
3. **Arrays**: tags e checklist devem ser arrays de strings
4. **Timestamps**: reminder_date pode ser null

---

## 🔄 APÓS CRIAR OS ENDPOINTS:

1. Teste cada endpoint no Xano
2. Verifique se retornam dados no formato correto
3. O código já foi atualizado para funcionar com esta estrutura
4. Categorias e notas aparecerão normalmente no seu app

Sua API: `https://x8ki-letl-twmt.n7.xano.io/api:G2JBF9sk`