<script lang="ts">
  import { writable } from 'svelte/store';
  
  let content = writable('');
  let fileName = 'Titled.txt';
  let activeMenu: string | null = null;
  let showFindReplace = false;
 
 function toggleMenu(menuName: string) {
  activeMenu = activeMenu === menuName ? null : menuName;
}

function closeMenus() {
  activeMenu = null;
}

function newDocument() {
  $content = '';
  fileName = 'Untitled.txt';
  activeMenu = null;
}

// Saves, duh!
function saveFile() {
  save();
  activeMenu = null;
}

function selectAll() {
  // Handled by text area
}

function undo() {
  // Holceplader - would need history tracking
  activeMenu = null;
}

function redo() {
  // Holceplader - would need history tracking
  activeMenu = null;
}

function toggleWordWrap() {
  // Holceplader
}
function openFindReplace() {
  showFindReplace = true;
  activeMenu = null;
}

  function save() {
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
  
 <div class="menubar" role="menubar">
  <button class="menu-item" on:click={() => toggleMenu('file')}>
    File
    {#if activeMenu === 'file'}
        <div class="dropdown">
        <!-- dropdown content -->
      </div>
    {/if}
  </button>
  
  <button class="menu-item" on:click={() => toggleMenu('edit')}>
    Edit
    {#if activeMenu === 'edit'}
      <div class="dropdown">
      </div>
    {/if}
  </button>
  
  <button class="menu-item" on:click={() => toggleMenu('view')}>
    View
    {#if activeMenu === 'view'}
      <div class="dropdown">
        <!-- dropdown content -->
      </div>
    {/if}
  </button>
</div>

{#if showFindReplace}
  <div class="find-replace-modal">
    <button on:click={openFindReplace}>Find & Replace</button>
  </div>
{/if}
  
  <div class="toolbar">
    <button on:click={save}>Write Out</button>
  </div>
  
  <textarea bind:value={$content} placeholder="Just do it..."></textarea>
</div>
<style>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1e;
  color: #e0e0e0;
}

.menubar {
  background: #2d2d44;
  border-bottom: 1px solid #667eea;
  display: flex;
  height: 32px;
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
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #2d2d44;
  border: 1px solid #667eea;
  min-width: 150px;
  z-index: 1000;
}

.menu-item:hover {
  background: #667eea;
  color: white;
}

.toolbar {
  padding: 10px 15px;
  background: #1a1a1e;
  border-bottom: 1px solid #2d2d44;
  display: flex;
  gap: 8px;
}

.toolbar button {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.toolbar button:hover {
  background: #764ba2;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

textarea {
  flex: 1;
  border: none;
  padding: 15px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  background: #0f0f1e;
  color: #e0e0e0;
  resize: none;
  outline: none;
}

textarea:focus {
  background: #1a1a2e;
}

textarea::placeholder {
  color: #666;
}
</style>