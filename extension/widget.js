// NotesApp Widget Script for New Tab

const API_BASE = 'https://your-app-domain.vercel.app/api';
let allNotes = [];
let currentFilter = 'all';

// Initialize widget when page loads
document.addEventListener('DOMContentLoaded', async () => {
  await loadNotes();
});

// Load all notes
async function loadNotes() {
  try {
    const response = await fetch(`${API_BASE}/notes`);
    allNotes = await response.json();
    displayNotes();
  } catch (error) {
    console.error('Error loading notes:', error);
    showError('Não foi possível carregar as notas. Verifique sua conexão.');
  }
}

// Display notes based on current filter
function displayNotes() {
  const notesGrid = document.getElementById('notesGrid');
  let filteredNotes = [...allNotes];
  
  // Apply filters
  switch (currentFilter) {
    case 'favorites':
      filteredNotes = allNotes.filter(note => note.isFavorite);
      break;
    case 'recent':
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filteredNotes = allNotes.filter(note => new Date(note.updatedAt) > sevenDaysAgo);
      break;
    case 'reminders':
      filteredNotes = allNotes.filter(note => note.reminderDate);
      break;
  }
  
  // Limit to 12 notes for better performance
  filteredNotes = filteredNotes.slice(0, 12);
  
  if (filteredNotes.length === 0) {
    notesGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5z" clip-rule="evenodd"></path>
        </svg>
        <h3>Nenhuma nota encontrada</h3>
        <p>${getEmptyStateMessage()}</p>
      </div>
    `;
    return;
  }
  
  notesGrid.innerHTML = filteredNotes.map(note => `
    <div class="note-card" onclick="openNote('${note.id}')">
      <div class="note-title">${escapeHtml(note.title)}</div>
      <div class="note-content">${escapeHtml(note.content)}</div>
      <div class="note-meta">
        <span>${formatDate(note.updatedAt)}</span>
        ${note.categoryId ? `
          <div class="category-tag">
            <div class="category-dot" style="background: ${getCategoryColor(note.categoryId)}"></div>
            ${getCategoryName(note.categoryId)}
          </div>
        ` : ''}
      </div>
      ${note.isFavorite ? '<div style="position: absolute; top: 12px; right: 12px;">⭐</div>' : ''}
      ${note.reminderDate ? '<div style="position: absolute; top: 12px; right: 32px;">🔔</div>' : ''}
    </div>
  `).join('');
}

// Handle filter buttons
function filterNotes(filter) {
  currentFilter = filter;
  
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  displayNotes();
}

// Handle quick add
function handleQuickAdd(event) {
  if (event.key === 'Enter') {
    addQuickNote();
  }
}

// Add quick note
async function addQuickNote() {
  const input = document.getElementById('quickNote');
  const content = input.value.trim();
  
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
      input.value = '';
      await loadNotes();
      
      // Show success animation
      input.style.background = 'rgba(16, 185, 129, 0.3)';
      setTimeout(() => {
        input.style.background = 'rgba(255, 255, 255, 0.2)';
      }, 1000);
    }
  } catch (error) {
    console.error('Error saving note:', error);
    showError('Erro ao salvar nota');
  }
}

// Open note in main app
function openNote(noteId) {
  window.open(`https://your-app-domain.vercel.app?note=${noteId}`, '_blank');
}

// Open full app
function openFullApp() {
  window.open('https://your-app-domain.vercel.app', '_blank');
}

// Refresh notes
async function refreshNotes() {
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '🔄 Carregando...';
  
  await loadNotes();
  
  button.textContent = '✅ Atualizado!';
  setTimeout(() => {
    button.textContent = originalText;
  }, 2000);
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
  if (diffDays < 7) return `${diffDays}d atrás`;
  return date.toLocaleDateString('pt-BR');
}

function getCategoryColor(categoryId) {
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

function getCategoryName(categoryId) {
  const names = {
    'trabalho': 'Trabalho',
    'pessoal': 'Pessoal',
    'estudos': 'Estudos', 
    'urgente': 'Urgente',
    'saude': 'Saúde',
    'receitas': 'Receitas',
  };
  return names[categoryId] || 'Categoria';
}

function getEmptyStateMessage() {
  switch (currentFilter) {
    case 'favorites': return 'Adicione algumas notas aos favoritos para vê-las aqui';
    case 'recent': return 'Nenhuma nota criada nos últimos 7 dias';
    case 'reminders': return 'Nenhuma nota com lembretes configurados';
    default: return 'Comece criando sua primeira nota!';
  }
}

function showError(message) {
  const notesGrid = document.getElementById('notesGrid');
  notesGrid.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <p style="color: #ef4444;">⚠️ ${message}</p>
    </div>
  `;
}