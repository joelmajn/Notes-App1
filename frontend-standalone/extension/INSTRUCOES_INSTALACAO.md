# 🚀 INSTRUÇÕES DE INSTALAÇÃO DA EXTENSÃO

## 📋 ANTES DE INSTALAR

### 1. Configurar URLs
Edite estes arquivos e mude as URLs para seu app no Vercel:

**📁 content.js** - Linha 8:
```javascript
this.APP_URL = 'https://SEU-APP.vercel.app'; // ⚠️ MUDE AQUI
```

**📁 popup.js** - Linha 3:
```javascript
const APP_URL = 'https://SEU-APP.vercel.app'; // ⚠️ MUDE AQUI
```

### 2. Adicionar Ícones
Crie ou baixe ícones PNG:
- `icons/icon16.png` (16x16 pixels)
- `icons/icon48.png` (48x48 pixels)  
- `icons/icon128.png` (128x128 pixels)

Você pode usar este ícone simples de nota: 📝

## 🔧 INSTALAÇÃO NO CHROME

### Passo 1: Preparar Arquivos
1. Baixe a pasta `extension` completa
2. Configure as URLs conforme acima
3. Adicione os ícones na pasta `icons/`

### Passo 2: Instalar no Chrome
1. Abra o Chrome
2. Digite: `chrome://extensions/`
3. Ative "Modo do desenvolvedor" (canto superior direito)
4. Clique "Carregar sem compactação"
5. Selecione a pasta `extension`
6. ✅ Pronto! Extensão instalada

## 🎯 COMO USAR

### Ativar Widget:
- Clique no ícone da extensão
- OU clique "Mostrar/Ocultar Widget"

### Funcionalidades:
- ✅ Widget flutua em todas as páginas
- ✅ Arraste para mover de posição
- ✅ Notas salvas automaticamente
- ✅ Sincroniza com seu app Xano
- ✅ Funciona offline
- ✅ Persiste ao fechar navegador

### Teclas de Atalho:
- `Ctrl + Enter` no textarea = Salvar nota rápida

## 📤 PUBLICAR NA CHROME WEB STORE

### 1. Preparar para Publicação:
```bash
# Comprimir arquivos
zip -r notes-widget-extension.zip extension/
```

### 2. Publicar:
1. Vá para: https://chrome.google.com/webstore/devconsole
2. Pague taxa única de $5 (conta desenvolvedor)
3. Suba o arquivo ZIP
4. Preencha informações:
   - Nome: "Notes Widget"
   - Descrição: "Widget de notas que fica em todas as páginas"
   - Categoria: "Produtividade"
5. Aguarde aprovação (1-3 dias)

## 🔄 ATUALIZAÇÕES

Para atualizar a extensão durante desenvolvimento:
1. Modifique os arquivos
2. Vá em `chrome://extensions/`
3. Clique "Recarregar" na sua extensão

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Widget não aparece:
- Recarregue a página
- Verifique se extensão está ativa
- Clique no ícone da extensão

### Notas não salvam:
- Verifique URL do Xano no `content.js`
- Teste com internet funcionando
- Verifique console do navegador (F12)

### URLs não funcionam:
- Confirme que mudou as URLs nos arquivos
- Teste se seu app Vercel está online
- Verifique se API Xano está configurada

## ✅ STATUS FINAL

Sua extensão está pronta para:
- ✅ Instalar no Chrome
- ✅ Funcionar em todas as páginas
- ✅ Salvar notas localmente
- ✅ Sincronizar com Xano
- ✅ Publicar na Chrome Web Store

Apenas mude as URLs e adicione ícones!