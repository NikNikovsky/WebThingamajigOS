<script lang="ts">
    import { onMount } from 'svelte';
    
    let files: { id: number; name: string; type: string; size: string; modified: string }[] = [];
    let currentPath: string = '/';
    
onMount(() => {
  loadFiles();  // Load initial files when component mounts
});
const mockFileSystem: { [key: string]: typeof files } = {
  '/': [
    { id: 1, name: 'Documents', type: 'folder', size: '-', modified: '2025-11-01' },
    { id: 2, name: 'Pictures', type: 'folder', size: '-', modified: '2025-11-01' },
    { id: 3, name: 'how to build a nuclear reactor.txt', type: 'file', size: '5 KB', modified: '2025-10-28' },
  ],
  '/Documents': [
    { id: 4, name: 'User Guide.pdf', type: 'file', size: '250 KB', modified: '2025-11-03' },
    { id: 5, name: 'Project.docx', type: 'file', size: '120 KB', modified: '2025-10-30' },
  ],
  '/Pictures': [
    { id: 6, name: 'good moaning.jpg', type: 'file', size: '53.4 KB', modified: '2025-04-09' },
    { id: 7, name: 'IsaacFurry.PNG', type: 'file', size: '141 KB', modified: '2025-04-09' },
  ],
};
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

function refresh() {
  // Reload files (mock)
  files = [...files];
}
function loadFiles() {
  files = mockFileSystem[currentPath] || [];
}
</script>

<div class="file-manager">
  <!-- TOOLBAR -->
  <div class="toolbar">
    <div class="navigation-buttons">
      <button on:click={goBack} title="Go back">←</button>
      <button on:click={goHome} title="Go home">🏠</button>
      <button on:click={refresh} title="Refresh">🔄</button>
    </div>
    
    <div class="address-bar">
      <span class="path-label">Location:</span>
      <input type="text" value={currentPath} readonly class="path-input">
    </div>
    
    <button class="new-folder-btn" title="New Folder">+ New Folder</button>
  </div>

  <!-- FILE LIST -->
  <div class="file-list">
    <div class="table-header">
      <div class="col-icon"></div>
      <div class="col-name">Name</div>
      <div class="col-type">Type</div>
      <div class="col-size">Size</div>
      <div class="col-modified">Modified</div>
    </div>

    <div class="table-body">
      {#each files as file (file.id)}
        <button 
          class="table-row" 
          on:dblclick={() => file.type === 'folder' && navigateToFolder(file.name)}
          type="button"
        >
          <div class="col-icon">
            {#if file.type === 'folder'}
              📁
            {:else}
              📄
            {/if}
          </div>
          <div class="col-name">{file.name}</div>
          <div class="col-type">{file.type}</div>
          <div class="col-size">{file.size}</div>
          <div class="col-modified">{file.modified}</div>
        </button>
      {:else}
        <div class="empty-message">No files in this directory</div>
      {/each}
    </div>
  </div>
</div>
<style>
  .file-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #0f0f1e;
    color: #e0e0e0;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: #1a1a2e;
    border-bottom: 1px solid #2d2d44;
  }

  .navigation-buttons {
    display: flex;
    gap: 5px;
  }

  .navigation-buttons button,
  .new-folder-btn {
    padding: 6px 10px;
    background: rgba(102, 126, 234, 0.2);
    border: 1px solid rgba(102, 126, 234, 0.4);
    border-radius: 4px;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.2s;
  }

  .navigation-buttons button:hover,
  .new-folder-btn:hover {
    background: rgba(102, 126, 234, 0.4);
  }

  .address-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .path-label {
    font-size: 12px;
    color: #a0a0a0;
  }

  .path-input {
    flex: 1;
    padding: 6px 8px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #2d2d44;
    border-radius: 4px;
    color: #e0e0e0;
  }

  .file-list {
    flex: 1;
    overflow-y: auto;
  }

  .table-header {
    display: grid;
    grid-template-columns: 30px 1fr 100px 80px 120px;
    gap: 12px;
    padding: 12px;
    background: #1a1a2e;
    border-bottom: 1px solid #2d2d44;
    font-weight: 600;
    font-size: 12px;
    color: #a0a0a0;
    position: sticky;
    top: 0;
  }

  .table-body {
    display: flex;
    flex-direction: column;
  }

 .table-row {
  display: grid;
  grid-template-columns: 30px 1fr 100px 80px 120px;
  gap: 12px;
  padding: 12px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  text-align: left;
  width: 100%;
}

  .table-row:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  .col-icon {
    text-align: center;
    font-size: 18px;
  }

  .col-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .col-type,
  .col-size,
  .col-modified {
    font-size: 12px;
    color: #a0a0a0;
  }

  .empty-message {
    padding: 40px 12px;
    text-align: center;
    color: #5d5d7d;
    font-size: 14px;
  }
</style>