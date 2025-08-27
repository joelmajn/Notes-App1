// NotesApp Extension Content Script

// Add floating save button for selected text
let saveButton = null;

// Handle text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length > 0) {
    showSaveButton(selection);
  } else {
    hideSaveButton();
  }
});

// Create and show save button
function showSaveButton(selection) {
  hideSaveButton(); // Remove existing button
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  saveButton = document.createElement('div');
  saveButton.innerHTML = '📝 Salvar no NotesApp';
  saveButton.style.cssText = `
    position: fixed;
    top: ${rect.bottom + window.scrollY + 5}px;
    left: ${rect.left + window.scrollX}px;
    background: #3b82f6;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.2s;
  `;
  
  saveButton.addEventListener('mouseenter', () => {
    saveButton.style.background = '#2563eb';
    saveButton.style.transform = 'translateY(-2px)';
  });
  
  saveButton.addEventListener('mouseleave', () => {
    saveButton.style.background = '#3b82f6';
    saveButton.style.transform = 'translateY(0)';
  });
  
  saveButton.addEventListener('click', () => {
    saveSelectedText();
    hideSaveButton();
  });
  
  document.body.appendChild(saveButton);
  
  // Auto-hide after 5 seconds
  setTimeout(hideSaveButton, 5000);
}

// Hide save button
function hideSaveButton() {
  if (saveButton) {
    saveButton.remove();
    saveButton = null;
  }
}

// Save selected text to notes
function saveSelectedText() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length === 0) return;
  
  const noteData = {
    title: `Texto de: ${document.title}`,
    content: selectedText,
    tags: ['web-clip', 'selecionado'],
    source_url: window.location.href
  };
  
  // Send to background script
  chrome.runtime.sendMessage({
    action: 'saveNote',
    noteData: noteData
  });
  
  // Clear selection
  selection.removeAllRanges();
  
  // Show success feedback
  showFeedback('💾 Texto salvo no NotesApp!');
}

// Show feedback message
function showFeedback(message) {
  const feedback = document.createElement('div');
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;
  
  // Add animation keyframes
  if (!document.querySelector('#notesapp-animations')) {
    const style = document.createElement('style');
    style.id = 'notesapp-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(feedback);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    feedback.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
}

// Hide save button when clicking elsewhere
document.addEventListener('click', (e) => {
  if (saveButton && !saveButton.contains(e.target)) {
    hideSaveButton();
  }
});

// Hide save button when scrolling
document.addEventListener('scroll', hideSaveButton);