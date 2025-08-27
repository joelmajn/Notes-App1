// NotesApp Extension Popup Script

const API_BASE = 'https://your-app-domain.vercel.app/api';

// Load notes when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  await loadNotes();
});

// Load recent notes
async function loadNotes() {
  try {
    const response = await fetch(`${API_BASE}/notes`);
    const notes = await response.json();
    
    const notesList = document.getElementById('notesList');
    
    if (notes.length === 0) {
      notesList.innerHTML = `
        <div class="empty-state">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5z" clip-rule="evenodd"></path>
          </svg>
          <p>Nenhuma nota ainda</p>
        </div>
      `;
      return;
    }
    
    // Show latest 5 notes
    const recentNotes = notes.slice(0, 5);
    notesList.innerHTML = recentNotes.map(note => `
      <div class="note-item" onclick="openNote('${note.id}')">
        <div class="note-title">${escapeHtml(note.title)}</div>
        <div class="note-content">${escapeHtml(note.content)}</div>
        <div class="note-meta">
          <span class="note-date">${formatDate(note.updatedAt)}</span>
          ${note.categoryId ? `<span class="category-dot" style="background: ${getCategoryColor(note.categoryId)}"></span>` : ''}
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading notes:', error);
    document.getElementById('notesList').innerHTML = `
      <div class="empty-state">
        <p>Erro ao carregar notas</p>
      </div>
    `;
  }
}

// Add quick note
async function addQuickNote() {
  const textarea = document.getElementById('quickNote');
  const content = textarea.value.trim();
  
  if (!content) return;
  
  try {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: content.split('\\n')[0].substring(0, 50) + (content.length > 50 ? '...' : ''),
        content: content,
        tags: [],
        checklist: [],
      }),
    });
    
    if (response.ok) {
      textarea.value = '';
      await loadNotes();
      
      // Show success feedback
      const button = textarea.nextElementSibling;
      const originalText = button.textContent;
      button.textContent = '✅ Salvo!';
      button.style.background = '#10b981';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#3b82f6';
      }, 2000);
    }
  } catch (error) {
    console.error('Error saving note:', error);
  }
}

// Open note in main app
function openNote(noteId) {
  chrome.tabs.create({
    url: `https://your-app-domain.vercel.app?note=${noteId}`
  });
}

// Open main app
function openApp() {
  chrome.tabs.create({
    url: 'https://your-app-domain.vercel.app'
  });
}

// Open widget (new tab)
function openWidget() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('widget.html')
  });
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem.`;
  return date.toLocaleDateString('pt-BR');
}

function getCategoryColor(categoryId) {
  // Default colors for categories
  const colors = {
    'trabalho': '#3b82f6',
    'pessoal': '#10b981',
    'estudos': '#8b5cf6',
    'urgente': '#ef4444',
    'saude': '#14b8a6',
    'receitas': '#ec4899',
  };
  return colors[categoryId] || '#6b7280';
}