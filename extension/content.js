// content.js - Script que injeta o widget em todas as páginas
class NotesWidget {
  constructor() {
    this.isVisible = false;
    this.isMinimized = false;
    this.widget = null;
    this.APP_URL = 'https://seu-app.vercel.app'; // MUDE AQUI para sua URL do Vercel
    this.XANO_API = 'https://x8ki-letl-twmt.n7.xano.io/api:G2JBF9sk';
    this.init();
  }

  async init() {
    // Verificar se já existe widget
    if (document.getElementById('notes-widget')) return;
    
    // Carregar estado persistente
    const state = await chrome.storage.local.get(['widgetVisible', 'widgetPosition', 'widgetMinimized']);
    this.isVisible = state.widgetVisible !== false; // Default true
    this.isMinimized = state.widgetMinimized || false;
    
    this.createWidget();
    
    if (this.isVisible) {
      this.showWidget();
    }
    
    // Carregar notas recentes
    this.loadRecentNotes();
  }

  createWidget() {
    // Criar container do widget
    this.widget = document.createElement('div');
    this.widget.id = 'notes-widget';
    this.widget.className = 'notes-widget-container';
    
    // HTML do widget
    this.widget.innerHTML = `
      <div class="notes-widget-header">
        <span class="notes-widget-title">📝 Notas</span>
        <div class="notes-widget-controls">
          <button id="notes-widget-minimize" title="Minimizar">−</button>
          <button id="notes-widget-close" title="Fechar">×</button>
        </div>
      </div>
      <div class="notes-widget-content" ${this.isMinimized ? 'style="display: none;"' : ''}>
        <div class="notes-widget-input-section">
          <textarea 
            id="notes-quick-input" 
            placeholder="Digite sua nota rápida..."
            maxlength="500"
          ></textarea>
          <div class="notes-widget-actions">
            <button id="notes-save-btn" class="btn-primary">💾 Salvar</button>
            <button id="notes-view-all" class="btn-secondary">📖 Ver Todas</button>
          </div>
        </div>
        <div class="notes-recent-section">
          <h4>Notas Recentes:</h4>
          <div id="notes-recent-list"></div>
        </div>
        <div class="notes-widget-footer">
          <small>Notas sincronizadas automaticamente</small>
        </div>
      </div>
    `;
    
    // Aplicar posição salva
    this.applyPosition();
    
    // Tornar arrastável
    this.makeDraggable();
    
    // Adicionar event listeners
    this.addEventListeners();
    
    // Adicionar ao DOM
    document.body.appendChild(this.widget);
  }

  async applyPosition() {
    const state = await chrome.storage.local.get(['widgetPosition']);
    const position = state.widgetPosition || { x: 20, y: 100 };
    
    this.widget.style.position = 'fixed';
    this.widget.style.left = position.x + 'px';
    this.widget.style.top = position.y + 'px';
    this.widget.style.zIndex = '2147483647'; // Máximo z-index
  }

  makeDraggable() {
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    
    const header = this.widget.querySelector('.notes-widget-header');
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - this.widget.offsetLeft;
      initialY = e.clientY - this.widget.offsetTop;
      header.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        // Manter dentro da viewport
        const maxX = window.innerWidth - this.widget.offsetWidth;
        const maxY = window.innerHeight - this.widget.offsetHeight;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        this.widget.style.left = currentX + 'px';
        this.widget.style.top = currentY + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
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
    
    // Enter para salvar (Ctrl+Enter)
    this.widget.querySelector('#notes-quick-input').addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        this.saveQuickNote();
      }
    });
    
    // Ver todas as notas
    this.widget.querySelector('#notes-view-all').addEventListener('click', () => {
      window.open(this.APP_URL, '_blank');
    });
  }

  async saveQuickNote() {
    const textarea = this.widget.querySelector('#notes-quick-input');
    const content = textarea.value.trim();
    
    if (!content) {
      this.showMessage('Digite alguma coisa primeiro!', 'warning');
      return;
    }
    
    this.showMessage('Salvando...', 'info');
    
    try {
      // Salvar localmente primeiro
      const now = new Date().toISOString();
      const localNote = {
        id: 'local_' + Date.now(),
        title: 'Nota Rápida',
        content,
        timestamp: now,
        synced: false
      };
      
      const { quickNotes = [] } = await chrome.storage.local.get(['quickNotes']);
      quickNotes.unshift(localNote);
      await chrome.storage.local.set({ quickNotes: quickNotes.slice(0, 20) });
      
      // Tentar sincronizar com Xano
      await this.syncWithXano(content);
      
      // Marcar como sincronizado
      localNote.synced = true;
      quickNotes[0] = localNote;
      await chrome.storage.local.set({ quickNotes });
      
      textarea.value = '';
      this.showMessage('✅ Nota salva!', 'success');
      this.loadRecentNotes();
      
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      this.showMessage('❌ Erro ao salvar', 'error');
    }
  }

  async syncWithXano(content) {
    try {
      const response = await fetch(`${this.XANO_API}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Nota Rápida - Widget',
          content: content,
          category_id: null,
          tags: ['widget', 'quick-note'],
          checklist: [],
          reminder_date: null,
          is_favorite: false,
          is_archived: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.log('Sincronização offline - salva localmente:', error);
      throw error;
    }
  }

  async loadRecentNotes() {
    const { quickNotes = [] } = await chrome.storage.local.get(['quickNotes']);
    const listContainer = this.widget.querySelector('#notes-recent-list');
    
    if (quickNotes.length === 0) {
      listContainer.innerHTML = '<div class="no-notes">Nenhuma nota ainda</div>';
      return;
    }
    
    listContainer.innerHTML = quickNotes.slice(0, 5).map(note => `
      <div class="recent-note ${note.synced ? 'synced' : 'local'}">
        <div class="recent-note-content">${this.truncateText(note.content, 60)}</div>
        <div class="recent-note-meta">
          <span class="recent-note-time">${this.formatTime(note.timestamp)}</span>
          <span class="sync-status">${note.synced ? '🌐' : '📱'}</span>
        </div>
      </div>
    `).join('');
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'agora';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
    return date.toLocaleDateString();
  }

  showMessage(message, type) {
    const existingMsg = this.widget.querySelector('.widget-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `widget-message ${type}`;
    msgDiv.textContent = message;
    
    this.widget.querySelector('.notes-widget-content').prepend(msgDiv);
    
    setTimeout(() => {
      if (msgDiv.parentNode) msgDiv.remove();
    }, 3000);
  }

  showWidget() {
    this.widget.style.display = 'block';
    this.isVisible = true;
    chrome.storage.local.set({ widgetVisible: true });
    this.loadRecentNotes();
  }

  hideWidget() {
    this.widget.style.display = 'none';
    this.isVisible = false;
    chrome.storage.local.set({ widgetVisible: false });
  }

  toggleMinimize() {
    const content = this.widget.querySelector('.notes-widget-content');
    this.isMinimized = !this.isMinimized;
    content.style.display = this.isMinimized ? 'none' : 'block';
    
    const minimizeBtn = this.widget.querySelector('#notes-widget-minimize');
    minimizeBtn.textContent = this.isMinimized ? '+' : '−';
    minimizeBtn.title = this.isMinimized ? 'Expandir' : 'Minimizar';
    
    chrome.storage.local.set({ widgetMinimized: this.isMinimized });
  }
}

// Aguardar DOM carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}

function initWidget() {
  // Aguardar um pouco para não interferir com carregamento da página
  setTimeout(() => {
    window.notesWidget = new NotesWidget();
  }, 1000);
}

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleWidget') {
    if (window.notesWidget) {
      if (window.notesWidget.isVisible) {
        window.notesWidget.hideWidget();
      } else {
        window.notesWidget.showWidget();
      }
    }
  }
  sendResponse({ success: true });
});