// NotesApp Extension Background Script

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('NotesApp Extension installed');
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'saveToNotesApp',
    title: 'Salvar no NotesApp',
    contexts: ['selection', 'page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToNotesApp') {
    handleSaveToNotes(info, tab);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'quick-note') {
    chrome.action.openPopup();
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveNote') {
    saveNoteToAPI(request.noteData);
  }
});

// Save selected text or page info to notes
async function handleSaveToNotes(info, tab) {
  let noteContent = '';
  let noteTitle = '';
  
  if (info.selectionText) {
    noteContent = info.selectionText;
    noteTitle = `Texto de: ${tab.title}`;
  } else {
    noteTitle = tab.title;
    noteContent = `Link: ${tab.url}\n\nSalvo de: ${tab.title}`;
  }
  
  const noteData = {
    title: noteTitle.length > 100 ? noteTitle.substring(0, 97) + '...' : noteTitle,
    content: noteContent,
    tags: ['web-clip'],
    source_url: tab.url
  };
  
  await saveNoteToAPI(noteData);
}

// Save note via API
async function saveNoteToAPI(noteData) {
  try {
    const response = await fetch('https://your-app-domain.vercel.app/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    
    if (response.ok) {
      // Show success notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'NotesApp',
        message: 'Nota salva com sucesso! 📝'
      });
    }
  } catch (error) {
    console.error('Error saving note:', error);
    
    // Show error notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'NotesApp - Erro',
      message: 'Não foi possível salvar a nota. Tente novamente.'
    });
  }
}

// Handle alarms for reminders
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('note-reminder-')) {
    showReminderNotification(alarm.name);
  }
});

// Show reminder notification
function showReminderNotification(alarmName) {
  const noteId = alarmName.replace('note-reminder-', '');
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: '🔔 Lembrete - NotesApp',
    message: 'Você tem um lembrete de nota!',
    buttons: [
      { title: 'Ver Nota' },
      { title: 'Dispensar' }
    ]
  });
}

// Handle notification clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) { // "Ver Nota" button
    chrome.tabs.create({
      url: 'https://your-app-domain.vercel.app'
    });
  }
  chrome.notifications.clear(notificationId);
});