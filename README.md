# Notes App - Frontend Standalone

Esta é uma versão standalone completa do frontend do aplicativo de notas. Todos os dados do backend foram substituídos por dados mockados locais para funcionar independentemente.

## Características

- ✅ Frontend completo com todos os componentes
- ✅ Dados mockados para demonstração
- ✅ Todas as funcionalidades principais funcionando
- ✅ Temas claro/escuro
- ✅ Interface responsiva
- ✅ Sistema de categorias e tags
- ✅ Busca e filtros
- ✅ Favoritos e arquivo

## Como usar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
npm run dev
```

3. Abra no navegador: `http://localhost:3000`

## Deploy no Vercel

Para fazer deploy no Vercel, siga estes passos:

1. Certifique-se de que todos os arquivos estão corretos
2. Faça push para um repositório Git
3. Conecte o repositório no Vercel
4. O build será automático usando as configurações em `vercel.json`

### Problemas Comuns

Se o design aparecer descofigurado:
- ✅ Verifique se `tailwind.config.ts` aponta para os caminhos corretos
- ✅ Confirme que `postcss.config.js` está configurado
- ✅ Verifique se todas as dependências do Tailwind estão instaladas
- ✅ Certifique-se de que o arquivo CSS está sendo importado corretamente

### Configurações para Deploy

- `vercel.json` - Configurações do Vercel
- `tailwind.config.ts` - Caminhos corretos para o conteúdo
- `vite.config.ts` - Configurações do build

## Estrutura

```
frontend-standalone/
├── src/
│   ├── components/     # Todos os componentes UI
│   ├── hooks/         # Hooks customizados
│   ├── lib/           # Utilitários e dados mockados
│   ├── pages/         # Páginas da aplicação
│   └── index.css      # Estilos globais
├── shared/            # Schemas compartilhados
├── public/            # Arquivos estáticos
└── package.json       # Dependências do frontend
```

## Dados Mockados

O arquivo `src/lib/mock-data.ts` contém:
- 5 notas de exemplo
- 4 categorias predefinidas  
- 5 tags de exemplo
- Simulação completa de todas as operações de API

## Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Criar build de produção
- `npm run preview` - Visualizar build de produção
- `npm run check` - Verificar tipos TypeScript

## Funcionalidades Implementadas

### Notas
- ✅ Criar, editar, excluir notas
- ✅ Busca por título e conteúdo
- ✅ Favoritar/desfavoritar
- ✅ Arquivar/desarquivar
- ✅ Sistema de checklist
- ✅ Lembretes

### Organização
- ✅ Categorias com cores
- ✅ Tags para classificação
- ✅ Filtros por categoria, tag, favoritos, arquivados
- ✅ Visualizações especiais (favoritos, arquivo, lembretes)

### Interface
- ✅ Design responsivo para mobile/desktop
- ✅ Temas claro/escuro
- ✅ Componentes shadcn/ui
- ✅ Animações suaves
- ✅ Interface intuitiva

## Tecnologias

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TanStack Query** - Gerenciamento de estado
- **Wouter** - Roteamento
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilização
- **Zod** - Validação de schemas

## Diferenças da Versão Original

1. **API substituída**: Em vez de chamadas HTTP para o backend, usa funções mockadas locais
2. **Dados persistentes**: Dados são mantidos apenas durante a sessão (não persistem entre reloads)
3. **Sem autenticação**: Não há sistema de login/autenticação
4. **Standalone**: Funciona independentemente, sem necessidade de backend

Este frontend standalone é perfeito para:
- Demonstrações
- Desenvolvimento de UI
- Testes de usabilidade
- Portfólio
- Base para outros projetos