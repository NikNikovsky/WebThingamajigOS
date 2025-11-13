<script lang="ts">
  import { writable } from 'svelte/store';
  import { fileDialogStore, openFileDialog, setCurrentlyOpen } from '../../state/fileDialogStore';
  import { windowStore } from '../../state/windowStore';
  import { fileSaveStore } from '../../state/fileSaveStore';
  import { preferencesStore } from '../../state/preferencesStore';
  import { lastFileStore } from '../../state/lastFileStore';
  import { onMount } from 'svelte';
  
  export let windowId: string;
  
  let content = writable('');
  let fileName = 'Untitled.txt';
  let filePath = '';
  let activeMenu: string | null = null;
  let showFindReplace = false;
  let isSaved = true;
  let fontSize = 14;
  let lastProcessedFileId = '';
  let history: string[] = [''];
  let historyIndex = 0;
  let findText = '';
  let replaceText = '';
  let findMatches = 0;
  let currentMatchIndex = 0;
  let selectedMatchStart = -1;
  let selectedMatchEnd = -1;
 
 function toggleMenu(menuName: string) {
  activeMenu = activeMenu === menuName ? null : menuName;
}

function closeMenus() {
  activeMenu = null;
}

// Undo/Redo Functions
function pushToHistory(newContent: string) {
  // Remove any redo history if user edits after undo
  history = history.slice(0, historyIndex + 1);
  history.push(newContent);
  historyIndex = history.length - 1;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    content.set(history[historyIndex]);
    isSaved = false;
  }
  activeMenu = null;
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    content.set(history[historyIndex]);
    isSaved = false;
  }
  activeMenu = null;
}

// Find & Replace Functions
function findAll() {
  if (!findText) {
    findMatches = 0;
    currentMatchIndex = 0;
    return;
  }
  
  const text = $content;
  let matches = 0;
  let index = 0;
  
  while ((index = text.indexOf(findText, index)) !== -1) {
    matches++;
    index += findText.length;
  }
  
  findMatches = matches;
  currentMatchIndex = 0;
  findNextMatch();
}

function findNextMatch() {
  if (!findText || findMatches === 0) return;
  
  const text = $content;
  let foundCount = 0;
  let index = 0;
  
  while ((index = text.indexOf(findText, index)) !== -1) {
    if (foundCount === currentMatchIndex) {
      selectedMatchStart = index;
      selectedMatchEnd = index + findText.length;
      break;
    }
    foundCount++;
    index += findText.length;
  }
  
  currentMatchIndex = (currentMatchIndex + 1) % findMatches;
}

function replaceCurrent() {
  if (selectedMatchStart === -1) return;
  
  const text = $content;
  const newContent = 
    text.substring(0, selectedMatchStart) + 
    replaceText + 
    text.substring(selectedMatchEnd);
  
  content.set(newContent);
  pushToHistory(newContent);
  isSaved = false;
  findAll(); // Re-find to update matches
}

function replaceAll() {
  if (!findText) return;
  
  const newContent = $content.replaceAll(findText, replaceText);
  content.set(newContent);
  pushToHistory(newContent);
  isSaved = false;
  findMatches = 0;
  currentMatchIndex = 0;
  selectedMatchStart = -1;
  selectedMatchEnd = -1;
}

function closeFindReplace() {
  showFindReplace = false;
  findText = '';
  replaceText = '';
  selectedMatchStart = -1;
  selectedMatchEnd = -1;
}

function newDocument() {
  $content = '';
  fileName = 'Entitled.txt';
  filePath = '';
  isSaved = true;
  history = [''];
  historyIndex = 0;
  activeMenu = null;
  windowStore.updateWindowTitle(windowId, 'Text Changer - Entitled.txt');
}

fileDialogStore.subscribe(dialog => {
  if (dialog.selectedFile && dialog.requestedBy === 'TextManipulator') {
    // Create a unique ID for this file to prevent reprocessing
    const fileId = `${dialog.selectedFile.path}-${dialog.selectedFile.name}-${Date.now()}`;
    if (lastProcessedFileId !== fileId) {
      lastProcessedFileId = fileId;
      content.set(dialog.selectedFile.content);
      fileName = dialog.selectedFile.name;
      filePath = dialog.selectedFile.path;
      isSaved = true;
      history = [dialog.selectedFile.content];
      historyIndex = 0;
      setCurrentlyOpen(dialog.selectedFile);
      windowStore.updateWindowTitle(windowId, `Text Changer - ${fileName}`);
      // Save this as the last opened file
      lastFileStore.setLastFile({
        name: dialog.selectedFile.name,
        path: dialog.selectedFile.path,
        content: dialog.selectedFile.content,
        type: dialog.selectedFile.type,
        size: dialog.selectedFile.size
      });
    }
  }
});

// Subscribe to preferences to get current value
let currentPreferences: any = {};
preferencesStore.subscribe(prefs => {
  currentPreferences = prefs;
});

// Auto-load last file on component mount if preference is enabled
onMount(() => {
  if (currentPreferences.rememberLastFile) {
    // Get the last file value once (not a persistent subscription)
    let lastFile: any;
    const unsubscribe = lastFileStore.subscribe(file => {
      lastFile = file;
    });
    unsubscribe(); // Immediately unsubscribe after getting the value
    
    if (lastFile && lastProcessedFileId === '') {
      content.set(lastFile.content);
      fileName = lastFile.name;
      filePath = lastFile.path;
      isSaved = true;
      history = [lastFile.content];
      historyIndex = 0;
      setCurrentlyOpen(lastFile);
      windowStore.updateWindowTitle(windowId, `Text Changer - ${fileName}`);
      lastProcessedFileId = `${lastFile.path}-${lastFile.name}`;
    }
  }
});

// Track changes to mark as unsaved and push to history
let lastHistorySave = '';
content.subscribe((newContent) => {
  if (fileName !== 'Entitled.txt' || filePath !== '') {
    isSaved = false;
  }
  
  // Debounce history saving - only add to history if content significantly changed
  if (newContent.length > lastHistorySave.length + 5 || newContent.length < lastHistorySave.length - 5) {
    lastHistorySave = newContent;
    pushToHistory(newContent);
  }
});

// Saves to mock file system
function saveFile() {
  if (filePath) {
    // Save to mock file system
    fileSaveStore.saveFile(filePath, $content);
    isSaved = true;
    windowStore.updateWindowTitle(windowId, `Text Changer - ${fileName}`);
    console.log(`[TextManipulator] File saved: ${filePath}`);
  } else {
    // For new documents, trigger a download
    downloadFile();
  }
  activeMenu = null;
}

function openFile() {
  openFileDialog('TextManipulator');
  activeMenu = null;
}

function selectAll() {
  // Handled by text area
}

  function downloadFile() {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent($content)}`);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<div class="editor">
  
  <div class="menubar-container">
    <div class="menubar" role="menubar">
      <button class="menu-item" on:click={() => toggleMenu('file')} aria-expanded={activeMenu === 'file'}>
        File
      </button>
      
      <button class="menu-item" on:click={() => toggleMenu('edit')} aria-expanded={activeMenu === 'edit'}>
        Edit
      </button>
      
      <button class="menu-item" on:click={() => toggleMenu('view')} aria-expanded={activeMenu === 'view'}>
        View
      </button>
    </div>

    {#if activeMenu === 'file'}
      <div class="dropdown" data-menu="file">
        <button class="dropdown-item" on:click={newDocument}>New</button>
        <button class="dropdown-item" on:click={openFile}>Open</button>
        <button class="dropdown-item" on:click={saveFile}>Save</button>
        <hr>
        <button class="dropdown-item" on:click={closeMenus}>Close Menu</button>
      </div>
    {/if}

    {#if activeMenu === 'edit'}
      <div class="dropdown" data-menu="edit">
        <button class="dropdown-item" on:click={undo}>Undo</button>
        <button class="dropdown-item" on:click={redo}>Redo</button>
        <hr>
        <button class="dropdown-item" on:click={selectAll}>Select All</button>
      </div>
    {/if}

    {#if activeMenu === 'view'}
      <div class="dropdown" data-menu="view">
        <button class="menu-item" on:click={() => { showFindReplace = !showFindReplace; activeMenu = null; }}>
          {showFindReplace ? '✓' : '  '} Find & Replace
        </button>
        <button class="menu-item" on:click={() => { fontSize = Math.min(fontSize + 2, 24); activeMenu = null; }}>
          🔍 Increase Font Size
        </button>
        <button class="menu-item" on:click={() => { fontSize = Math.max(fontSize - 2, 10); activeMenu = null; }}>
          🔍 Decrease Font Size
        </button>
        <hr class="menu-divider" />
        <button class="menu-item" on:click={() => { fontSize = 14; activeMenu = null; }}>
          Reset Font Size
        </button>
      </div>
    {/if}
  </div>

{#if showFindReplace}
  <div class="find-replace-bar">
    <div class="find-replace-content">
      <div class="input-group">
        <label for="find-input">Find:</label>
        <input 
          id="find-input"
          type="text" 
          bind:value={findText} 
          placeholder="Find text..."
          on:input={findAll}
        />
        <span class="match-count">{findMatches > 0 ? currentMatchIndex + 1 : 0} / {findMatches}</span>
      </div>

      <div class="input-group">
        <label for="replace-input">Replace:</label>
        <input 
          id="replace-input"
          type="text" 
          bind:value={replaceText} 
          placeholder="Replace with..."
        />
      </div>

      <div class="button-group">
        <button on:click={findNextMatch} disabled={findMatches === 0}>Find Next</button>
        <button on:click={replaceCurrent} disabled={selectedMatchStart === -1}>Replace</button>
        <button on:click={replaceAll} disabled={findMatches === 0}>Replace All</button>
        <button on:click={closeFindReplace} class="close-btn">Close</button>
      </div>
    </div>
  </div>
{/if}
  
  <textarea bind:value={$content} placeholder="Just do it..." style="font-size: {fontSize}px;"></textarea>
</div>
<style>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
 
  color: #e0e0e0;
}

.menubar {
  
  border-bottom: 1px solid var(--accent-color);
  display: flex;
  height: 32px;
}

.menubar-container {
  position: relative;
}

.menu-item {
  position: relative;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px 15px;
  font-size: 13px;
  transition: background 0.2s;
}
.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 15px;
  background: none;
  border: none;
  color: #e0e0e0;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
  font-family: inherit;
}

.dropdown-item:hover {
  background: var(--accent-color);
  color: white;
}

.dropdown hr {
  margin: 4px 0;
  border: none;
  border-top: 1px solid var(--accent-color);
}

.dropdown {
  position: absolute;
  top: 32px;
  left: 0;
  background: rgba(30, 30, 45, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--accent-color);
  min-width: 150px;
  z-index: 1000;
  border-radius: 6px;
  overflow: hidden;
}

.dropdown[data-menu="edit"] {
  left: 50px;
}

.dropdown[data-menu="view"] {
  left: 100px;
}

.menu-item:hover {
  background: var(--accent-color);
  color: white;
}

.find-replace-bar {
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid var(--accent-color);
  padding: 12px 15px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.find-replace-content {
  display: flex;
  gap: 15px;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group label {
  font-size: 12px;
  font-weight: 500;
  color: #a0a0a0;
  white-space: nowrap;
}

.input-group input {
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--accent-color);
  border-radius: 3px;
  color: #e0e0e0;
  font-size: 12px;
  width: 200px;
}

.input-group input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.match-count {
  font-size: 11px;
  color: #a0a0a0;
  margin-left: 5px;
  white-space: nowrap;
}

.button-group {
  display: flex;
  gap: 6px;
}

.button-group button {
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid var(--accent-color);
  color: #e0e0e0;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.button-group button:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
}

.button-group button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.button-group button.close-btn {
  background: transparent;
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff6464;
}

.button-group button.close-btn:hover {
  background: rgba(255, 100, 100, 0.2);
  border-color: rgba(255, 100, 100, 0.6);
}

textarea {
  flex: 1;
  border: none;
  padding: 15px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: var(--accent-color);
  resize: none;
  outline: none;
}

textarea:focus {
  background: #1a1a2e;
}

textarea::placeholder {
  color: #666;
}

.menu-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 5px 0;
}
</style>