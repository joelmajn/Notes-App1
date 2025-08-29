// background.js - Service Worker da extensão
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Notes Widget instalado/atualizado');
  
  // Configurações iniciais
  await chrome.storage.local.set({
    widgetVisible: true,
    widgetPosition: { x: 20, y: 100 },
    widgetMinimized: false,
    quickNotes: []
  });
  
  if (details.reason === 'install') {
    // Primeira instalação
    console.log('Primeira instalação do Notes Widget');
    
    // Criar aba de boas-vindas (opcional)
    // chrome.tabs.create({ url: 'https://seu-app.vercel.app' });
  }
});

// Listener para comandos de teclado (se configurado no manifest)
chrome.commands?.onCommand.addListener(async (command) => {
  if (command === 'toggle-widget') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
    } catch (error) {
      console.log('Não foi possível enviar mensagem para a aba:', error);
    }
  }
});

// Listener para cliques no ícone da extensão
chrome.action.onClicked.addListener(async (tab) => {
  // Se não houver popup definido, toggle o widget diretamente
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
  } catch (error) {
    console.log('Não foi possível enviar mensagem para a aba:', error);
  }
});

// Sincronização periódica (opcional)
chrome.alarms?.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'sync-notes') {
    console.log('Sincronização automática de notas');
    // Implementar lógica de sincronização aqui
  }
});

// Criar alarme para sincronização (a cada 30 minutos)
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms?.create('sync-notes', { periodInMinutes: 30 });
});

// Limpar dados quando a extensão for desinstalada
chrome.runtime.onSuspend.addListener(() => {
  console.log('Extension suspending');
});

// Gerenciar contexto de mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    chrome.storage.local.get(['widgetVisible', 'widgetPosition']).then(sendResponse);
    return true; // Para resposta assíncrona
  }
  
  if (message.action === 'saveSettings') {
    chrome.storage.local.set(message.settings).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});