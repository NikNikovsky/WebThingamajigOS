<script lang="ts">
  import { fileDialogStore, closeFileDialog } from '../state/fileDialogStore';
  import { fileSaveStore } from '../state/fileSaveStore';
  
  let files: { id: number; name: string; type: string; size: string; modified: string }[] = [];
  let currentPath: string = '/';
  let dialog: any;
  let savedFiles: any = {};
  
  // Subscribe to saved files
  fileSaveStore.subscribe(fileContents => {
    savedFiles = fileContents;
  });

  // Same mock file system as FileMangler (skeleton - actual files come from fileSaveStore)
  const mockFileSystem: { [key: string]: typeof files } = {
    '/': [
      { id: 1, name: 'Documents', type: 'folder', size: '-', modified: '2025-11-01' },
      { id: 2, name: 'Pictures', type: 'folder', size: '-', modified: '2025-11-01' },
      { id: 3, name: 'how to build a nuclear reactor.txt', type: 'file', size: '5 KB', modified: '2025-10-28' },
    ],
    '/Documents': [
      { id: 4, name: 'User Guide.pdf', type: 'file', size: '250 KB', modified: '2025-11-03' },
      { id: 5, name: 'Evidence that Spy had contact with Scout\'s mother.zip', type: 'file', size: '1.5GB', modified: '2025-11-06' },
    ],
    '/Pictures': [
      { id: 6, name: 'good moaning.jpg', type: 'file', size: '53.4 KB', modified: '2025-04-09' },
      { id: 7, name: 'genocide.png', type: 'file', size: '141 KB', modified: '2025-04-09' },
    ],
  };

  fileDialogStore.subscribe(d => {
    dialog = d;
  });

  function loadFiles() {
    files = mockFileSystem[currentPath] || [];
  }

  // Load initial files on mount
  loadFiles();

  function navigateToFolder(folderName: string) {
    if (currentPath === '/') {
      currentPath = '/' + folderName;
    } else {
      currentPath = currentPath + '/' + folderName;
    }
    loadFiles();
  }

  function goBack() {
    if (currentPath !== '/') {
      const parts = currentPath.split('/').filter(p => p);
      parts.pop();
      currentPath = '/' + parts.join('/');
    }
    loadFiles();
  }

  function goHome() {
    currentPath = '/';
    loadFiles();
  }

  function handleFileSelect(file: any) {
    if (file.type === 'folder') {
      navigateToFolder(file.name);
    } else {
      // File selected - get its content from savedFiles (fileSaveStore)
      const extension = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')).toLowerCase() : '';
      const blockedForTextEditor = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
      if (dialog?.requestedBy === 'TextManipulator' && blockedForTextEditor.includes(extension)) {
      return;
}     const filePath = currentPath === '/' ? '/' + file.name : currentPath + '/' + file.name;
      const content = savedFiles[filePath] || `[File content for ${file.name}]`;
      
      fileDialogStore.update(state => ({
        ...state,
        selectedFile: {
          name: file.name,
          path: filePath,
          content: content,
          type: file.type,
          size: file.size
        }
      }));
      
      closeFileDialog();
    }
  }

  function handleCancel() {
    closeFileDialog();
  }
</script>

{#if dialog?.isOpen}
  <div class="file-dialog-overlay" role="presentation" on:click={handleCancel} on:keydown={() => {}}>
    <div class="file-dialog" role="dialog" aria-modal="true" tabindex="0" on:click|stopPropagation on:keydown={() => {}}>
      <div class="dialog-header">
        <h2>Open File</h2>
        <button class="close-btn" on:click={handleCancel}>✕</button>
      </div>

      <div class="navigation-bar">
        <button on:click={goHome} title="Home">🏠</button>
        <button on:click={goBack} title="Back" disabled={currentPath === '/'}>←</button>
        <div class="path-display">{currentPath}</div>
      </div>

      <div class="file-list">
        {#each files as file (file.id)}
          <button 
            class="file-item {file.type}" 
            on:click={() => handleFileSelect(file)}
            on:dblclick={() => file.type === 'folder' && handleFileSelect(file)}
          >
            <span class="icon">{file.type === 'folder' ? '📁' : '📄'}</span>
            <span class="name">{file.name}</span>
            <span class="size">{file.size}</span>
            <span class="date">{file.modified}</span>
          </button>
        {/each}
      </div>

      <div class="dialog-footer">
        <button class="cancel-btn" on:click={handleCancel}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .file-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5000;
  }

  .file-dialog {
    background: #f5f5f5;
    border: 2px solid #333;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 500px;
    overflow: hidden;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: 1px solid #ddd;
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 1.3em;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5em;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .navigation-bar {
    display: flex;
    gap: 10px;
    padding: 10px 15px;
    background: #e8e8e8;
    border-bottom: 1px solid #ddd;
    align-items: center;
  }

  .navigation-bar button {
    padding: 6px 12px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .navigation-bar button:hover:not(:disabled) {
    background: #f0f0f0;
    border-color: #667eea;
  }

  .navigation-bar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .path-display {
    flex: 1;
    font-size: 0.9em;
    color: #333;
    padding: 0 10px;
    font-family: 'Courier New', monospace;
  }

  .file-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }

  .file-item {
    display: grid;
    grid-template-columns: 30px 1fr 80px 100px;
    gap: 15px;
    padding: 12px 15px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    align-items: center;
    transition: background-color 0.2s;
    font-size: 0.95em;
    background: none;
    border: none;
    border-radius: 0;
    text-align: left;
    width: 100%;
    font-family: inherit;
    color: #222;
  }

  .file-item:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  .file-item:focus {
    outline: 2px solid #667eea;
    outline-offset: -2px;
  }

  .file-item.folder {
    font-weight: bold;
  }

  .icon {
    text-align: center;
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .size {
    text-align: right;
    font-size: 0.85em;
    color: #666;
  }

  .date {
    text-align: right;
    font-size: 0.85em;
    color: #666;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    background: #f0f0f0;
    border-top: 1px solid #ddd;
  }

  .cancel-btn {
    padding: 8px 20px;
    background: #e0e0e0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-btn:hover {
    background: #d0d0d0;
    border-color: #999;
  }
</style>
