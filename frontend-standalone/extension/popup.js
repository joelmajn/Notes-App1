// popup.js - Controles do popup da extensão
document.addEventListener('DOMContentLoaded', function() {
  const APP_URL = 'https://seu-app.vercel.app'; // MUDE AQUI para sua URL do Vercel
  
  // Elementos
  const toggleBtn = document.getElementById('toggle-widget');
  const openAppBtn = document.getElementById('open-app');
  const syncBtn = document.getElementById('sync-notes');
  const clearBtn = document.getElementById('clear-cache');
  const statusText = document.getElementById('status-text');
  
  // Carregar estado inicial
  loadWidgetStatus();
  
  // Event Listeners
  toggleBtn.addEventListener('click', toggleWidget);
  openAppBtn.addEventListener('click', openApp);
  syncBtn.addEventListener('click', syncNotes);
  clearBtn.addEventListener('click', clearCache);
  
  async function loadWidgetStatus() {
    try {
      const state = await chrome.storage.local.get(['widgetVisible', 'quickNotes']);
      const isVisible = state.widgetVisible !== false;
      const notesCount = (state.quickNotes || []).length;
      
      toggleBtn.textContent = `${isVisible ? '👁️' : '👁️‍🗨️'} ${isVisible ? 'Ocultar' : 'Mostrar'} Widget`;
      statusText.textContent = `${notesCount} notas locais`;
    } catch (error) {
      statusText.textContent = 'Erro ao carregar status';
    }
  }
  
  async function toggleWidget() {
    try {
      statusText.textContent = 'Alternando widget...';
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });
      
      if (response && response.success) {
        setTimeout(() => {
          loadWidgetStatus();
          statusText.textContent = 'Widget alternado!';
        }, 100);
      } else {
        statusText.textContent = 'Erro: Recarregue a página';
      }
      
    } catch (error) {
      console.error('Erro ao alternar widget:', error);
      statusText.textContent = 'Erro: Recarregue a página';
    }
    
    // Fechar popup após 1 segundo
    setTimeout(() => {
      window.close();
    }, 1000);
  }
  
  function openApp() {
    chrome.tabs.create({ url: APP_URL });
    window.close();
  }
  
  async function syncNotes() {
    try {
      statusText.textContent = 'Sincronizando...';
      
      const { quickNotes = [] } = await chrome.storage.local.get(['quickNotes']);
      const unsyncedNotes = quickNotes.filter(note => !note.synced);
      
      if (unsyncedNotes.length === 0) {
        statusText.textContent = 'Tudo sincronizado!';
        return;
      }
      
      // Aqui você pode implementar lógica de sincronização
      // Por agora, apenas marcamos como sincronizado
      const updatedNotes = quickNotes.map(note => ({
        ...note,
        synced: true
      }));
      
      await chrome.storage.local.set({ quickNotes: updatedNotes });
      statusText.textContent = `${unsyncedNotes.length} notas sincronizadas`;
      
    } catch (error) {
      statusText.textContent = 'Erro na sincronização';
    }
  }
  
  async function clearCache() {
    try {
      const confirmed = confirm('Tem certeza que quer limpar todas as notas locais?');
      if (!confirmed) return;
      
      statusText.textContent = 'Limpando cache...';
      
      await chrome.storage.local.clear();
      await chrome.storage.local.set({
        widgetVisible: true,
        widgetPosition: { x: 20, y: 100 },
        widgetMinimized: false
      });
      
      statusText.textContent = 'Cache limpo!';
      
      setTimeout(() => {
        loadWidgetStatus();
      }, 500);
      
    } catch (error) {
      statusText.textContent = 'Erro ao limpar cache';
    }
  }
});